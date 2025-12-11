// spipu-ui/spipu-graph-plots.js

class SpipuGraphPlots {
    constructor(
        destinationId,
        dateFrom,
        dateTo,
        source,
        forceMinToZero,
        dateFormat = "yyyy-MM-dd HH:mm",
        margeBottom = 60,
    ) {
        this.graph = new GoogleGraphPlots(
            destinationId,
            dateFrom,
            dateTo,
            source,
            forceMinToZero,
            dateFormat,
            margeBottom
        );
    }
}

window.SpipuGraphPlots = SpipuGraphPlots;
