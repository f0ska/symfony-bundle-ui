// spipu-ui.js

// Spipu Ui - Global
function SpipuUi()
{
}

SpipuUi.prototype.init = function () {
    this.initConfirm();
    this.initGrids();
    this.initCheckboxTrees();
}

SpipuUi.prototype.initConfirm = function () {
    $(".confirm-action").click(
        function () {
            let actionName = $(this).data('action-role');
            if (!actionName) {
                actionName = 'make this action on';
            }
            return confirm('Do you really want to ' + actionName + ' this item ?');
        }
    );
};

SpipuUi.prototype.initGrids = function () {
    $("span[data-grid-role=total-rows]").each(
        function () {
            new SpipuUiGrid($(this).data('grid-code'));
        }
    )
};

SpipuUi.prototype.initCheckboxTrees = function () {
    $("ul.checkbox-tree").each(
        function () {
            new SpipuUiCheckboxTree($(this));
        }
    )
};

SpipuUi.prototype.submitForm = function (code) {
    $("form#form_" + code + " :submit").click();
}

// Spipu Ui - Grid
function SpipuUiGrid(code)
{
    this.code = code;
    this.count = 0;
    this.ids = [];
    this.config = [];
    this.personalizeSorting = {
        'dragging': null,
        'draggedOver': null
    };

    this.init();
}

SpipuUiGrid.prototype.getElement = function (role) {
    return $("[data-grid-code=" + this.code + "][data-grid-role=" + role + "]");
};

SpipuUiGrid.prototype.getValue = function (target) {
    return parseInt($(target).val());
};

SpipuUiGrid.prototype.init = function () {
    if (this.getElement('checkbox-all')) {
        this.massActionsInit();
        this.massActionsUpdate();
    }

    if (this.getElement('filter-open')) {
        this.filtersInit();
    }

    if (this.getElement('config-form')) {
        this.personalizeInit();
    }
}

SpipuUiGrid.prototype.filtersInit = function () {
    this.getElement('filter-cancel').click($.proxy(this.filtersReset, this));
    this.getElement('filter-open').click($.proxy(this.filtersOpen, this));
}

SpipuUiGrid.prototype.filtersOpen = function () {
    this.getElement('search-header-collapse').collapse('hide');
    this.getElement('config-columns-collapse').collapse('hide');
    this.getElement('config-create-collapse').collapse('hide');
    this.getElement('filter-collapse').collapse('show');
}

SpipuUiGrid.prototype.personalizeInit = function () {
    this.getElement('config-select').on('change', $.proxy(this.personalizeSelect, this));
    this.getElement('config-create').click($.proxy(this.personalizeCreate, this));
    this.getElement('config-delete').click($.proxy(this.personalizeDelete, this));
    this.getElement('config-configure').click($.proxy(this.personalizeConfigure, this));
    this.getElement('config-cancel').click($.proxy(this.personalizeCancel, this));

    this.personalizeSortColumnsInit();
}

SpipuUiGrid.prototype.personalizeCancel = function () {
    window.location.reload();
}

SpipuUiGrid.prototype.personalizeDelete = function () {
    this.getElement('config-form-action').val('delete');
}

SpipuUiGrid.prototype.personalizeCreate = function () {
    this.getElement('filter-collapse').collapse('hide');
    this.getElement('search-header-collapse').collapse('hide');
    this.getElement('config-select-collapse').collapse('hide');
    this.getElement('config-columns-collapse').collapse('hide');
    this.getElement('config-create-collapse').collapse('show');
}

SpipuUiGrid.prototype.personalizeConfigure = function () {
    this.getElement('filter-collapse').collapse('hide');
    this.getElement('search-header-collapse').collapse('hide');
    this.getElement('config-select-collapse').collapse('hide');
    this.getElement('config-create-collapse').collapse('hide');
    this.getElement('config-columns-collapse').collapse('show');
}

SpipuUiGrid.prototype.personalizeSelect = function () {
    this.getElement('config-select-form').submit();
}

SpipuUiGrid.prototype.personalizeSortColumnsInit = function () {
    let items;

    items = this.getElement('config-form-columns-hide').find('li');
    this.personalizeSortColumnsInitReset(items);
    items.find('.list-action-show').show();

    items = this.getElement('config-form-columns-show').find('li');
    this.personalizeSortColumnsInitReset(items);
    items.find('.list-action-hide').show();
    items.find('.list-action-sort').show();

    items = items.slice(0, -1);
    items.on('dragover', $.proxy(this.personalizeSortColumnsDragOver, this));
    items.on('drop',     $.proxy(this.personalizeSortColumnsDrop, this));
    items = items.slice(1);
    items.on('drag',     $.proxy(this.personalizeSortColumnsDrag, this));
    items.on('dragend',  $.proxy(this.personalizeSortColumnsDrop, this));
    items.attr('draggable', true);
    items.css('cursor', 'move');

    this.personalizeSortColumnsStart();
    this.personalizeSortColumnsStyle();
}

SpipuUiGrid.prototype.personalizeSortColumnsInitReset = function (items) {
    items.attr('draggable', false);
    items.css('cursor', '');
    items.off();
    items.find('.list-action-sort').off().hide();
    items.find('.list-action-show').off().hide().on('click', $.proxy(this.personalizeSortColumnsShow, this));
    items.find('.list-action-hide').off().hide().on('click', $.proxy(this.personalizeSortColumnsHide, this));
}

SpipuUiGrid.prototype.personalizeSortColumnsShow = function (event) {
    event.preventDefault();

    let item = $(event.target).closest('li');
    item.find('.list-action-show').hide();
    item.find('.list-action-hide').show();
    item.find('.list-action-sort').show();

    this.getElement('config-form-columns-show').find('li.list-fake-row').before(item);

    this.personalizeSortColumnsInit();
}

SpipuUiGrid.prototype.personalizeSortColumnsHide = function (event) {
    event.preventDefault();

    let item = $(event.target).closest('li');
    item.find('.list-action-show').show();
    item.find('.list-action-hide').hide();
    item.find('.list-action-sort').hide();

    this.getElement('config-form-columns-hide').append(item);

    this.personalizeSortColumnsInit();
}

SpipuUiGrid.prototype.personalizeSortColumnsDrag = function (event) {
    this.personalizeSortColumnsStart();
    this.personalizeSorting.dragging = $(event.target).closest('li');
}

SpipuUiGrid.prototype.personalizeSortColumnsDragOver = function (event) {
    event.preventDefault();

    this.personalizeSortColumnsStyle();
    if (!this.personalizeSorting.dragging) {
        return;
    }

    let draggedOver = $(event.target).closest('li');
    let posMiddle = parseInt(draggedOver.offset().top + 0.5 * draggedOver.height() + 10);
    let posCurrent = event.pageY;

    if (posCurrent < posMiddle && draggedOver.prev('li')) {
        draggedOver = draggedOver.prev('li');
    }

    this.personalizeSorting.draggedOver = draggedOver;
    this.personalizeSorting.draggedOver.addClass('border-primary');
    this.personalizeSorting.dragging.addClass('list-group-item-secondary');
}

SpipuUiGrid.prototype.personalizeSortColumnsDrop = function (event) {
    if (this.personalizeSorting.dragging && this.personalizeSorting.draggedOver) {
        this.personalizeSorting.draggedOver.after(this.personalizeSorting.dragging);
    }

    this.personalizeSortColumnsStyle();
    this.personalizeSortColumnsStart();
}

SpipuUiGrid.prototype.personalizeSortColumnsStyle = function () {
    let items;

    items = this.getElement('config-form-columns-show').find('li');
    items.removeClass('border-primary');
    items.removeClass('list-group-item-secondary');

    items = this.getElement('config-form-columns-hide').find('li');
    items.removeClass('border-primary');
    items.removeClass('list-group-item-secondary');
}

SpipuUiGrid.prototype.personalizeSortColumnsStart = function () {
    this.personalizeSorting = {
        'dragging': null,
        'draggedOver': null
    };
}

SpipuUiGrid.prototype.filtersReset = function () {
    let form = this.getElement('filter-form');

    form.find('input').val('');
    form.find('select').val('');
    form.submit();
}
SpipuUiGrid.prototype.massActionsInit = function () {
    let that = this;

    that.getElement('checkbox').prop("checked", false);
    that.getElement('checkbox-all').prop("checked", false);

    that.getElement('checkbox')
        .change(function () { that.checkChange(this); })
        .click(function (e) { e.stopPropagation(); })
        .parent().click(function () { $(this).children().trigger('click'); });

    that.getElement('checkbox-all')
        .change(function () { that.checkAllChange(this); })
        .click(function (e) { e.stopPropagation(); })
        .parent().click(function () { $(this).children().trigger('click'); });

    that.getElement('action').click(function () { that.actionSelected(this) });
};

SpipuUiGrid.prototype.massActionsUpdate = function () {
    this.count = this.ids.length;
    this.getElement('count').html(this.count);

    if (this.count > 0) {
        this.getElement('action').show();
        this.getElement('no-action').hide();
    } else {
        this.getElement('action').hide();
        this.getElement('no-action').show();
    }
};

SpipuUiGrid.prototype.checkChange = function (target) {
    let value = this.getValue(target);
    let checked = $(target).prop("checked");

    this.ids = $.grep(
        this.ids,
        function (id) {
            return id !== value;
        }
    );

    if (checked) {
        this.ids.push(value);
    }

    this.getElement('checkbox-all').prop("checked", false);

    this.massActionsUpdate();
};

SpipuUiGrid.prototype.checkAllChange = function (target) {
    let checked = $(target).prop("checked");
    let that = this;

    that.getElement('checkbox').prop("checked", checked);

    that.ids = [];
    if (checked) {
        that.getElement('checkbox').each(
            function () {
                that.ids.push(that.getValue(this));
            }
        );
    }

    that.massActionsUpdate();
};

SpipuUiGrid.prototype.actionSelected = function (target) {
    let form = $(
        '<form />',
        {
            method: 'post',
            action: $(target).data('grid-href')
        }
    );

    form.append($(
        '<input>',
        {
            type: 'hidden',
            name: 'selected',
            value: JSON.stringify(this.ids)
        }
    ));

    form.appendTo('body').submit();
};

// Spipu Ui - CheckBox Tree
function SpipuUiCheckboxTree(mainNode)
{
    this.mainNode = mainNode
    this.code = mainNode.data('tree-code');
    this.init();
}

SpipuUiCheckboxTree.prototype.init = function () {
    let that = this;

    let inputs = this.mainNode.find('input[type=checkbox]');

    inputs.on('change', function () { that.change($(this)); });
    inputs.each(function() { that.toggleChildren($(this)); });
}

SpipuUiCheckboxTree.prototype.change = function (node) {
    node.closest('li').find('ul li input[type=checkbox]').prop('checked', false);

    this.toggleChildren(node);

}

SpipuUiCheckboxTree.prototype.toggleChildren = function (node) {
    node.closest('li').find('ul').toggleClass('useless-node', node.prop('checked'));
}

window.spipuUi = new SpipuUi();

$(document).ready(
    function () {
        spipuUi.init();
    }
);
