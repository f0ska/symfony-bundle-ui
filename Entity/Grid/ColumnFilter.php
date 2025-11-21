<?php

/**
 * This file is part of a Spipu Bundle
 *
 * (c) Laurent Minguet
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Spipu\UiBundle\Entity\Grid;

class ColumnFilter
{
    /**
     * @var bool
     */
    private $filterable;

    /**
     * @var bool
     */
    private $quickSearch;

    /**
     * @var bool
     */
    private $range;

    /**
     * @var bool
     */
    private $exactValue;

    /**
     * @var bool
     */
    private $multipleValues;

    /**
     * @var string|null
     */
    private $templateFilter;

    /**
     * @var string|null
     */
    private $columnType;

    /**
     * Pager constructor.
     * @param bool $filterable
     * @param bool $quickSearch
     * @SuppressWarnings(PMD.BooleanArgumentFlag)
     */
    public function __construct(
        bool $filterable = false,
        bool $quickSearch = false
    ) {
        $this->filterable = $filterable;
        $this->quickSearch = $quickSearch;
        $this->range = false;
        $this->exactValue = false;
        $this->multipleValues = false;
    }

    /**
     * @param ColumnType $columnType
     * @return void
     */
    public function linkToColumnType(ColumnType $columnType): void
    {
        $this->columnType = $columnType->getType();
    }

    /**
     * @return bool
     */
    public function isFilterable(): bool
    {
        return $this->filterable;
    }

    /**
     * @return bool
     */
    public function isQuickSearch(): bool
    {
        return $this->quickSearch;
    }

    /**
     * @return bool
     */
    public function isRange(): bool
    {
        return $this->range;
    }

    /**
     * @param bool $range
     * @return self
     * @SuppressWarnings(PMD.BooleanArgumentFlag)
     */
    public function useRange(bool $range = true): self
    {
        $this->range = $range;
        $this->multipleValues = false;

        return $this;
    }

    /**
     * @return bool
     */
    public function isExactValue(): bool
    {
        return $this->exactValue;
    }

    /**
     * @param bool $exactValue
     * @return self
     * @SuppressWarnings(PMD.BooleanArgumentFlag)
     */
    public function useExactValue(bool $exactValue = true): self
    {
        $this->exactValue = $exactValue;

        return $this;
    }

    /**
     * @return string
     */
    public function getTemplateFilter(): string
    {
        if ($this->templateFilter !== null) {
            return $this->templateFilter;
        }

        $templateCode = $this->columnType;
        if ($this->multipleValues) {
            $templateCode .= '-multiple';
        }

        return '@SpipuUi/grid/filter/' . $templateCode . '.html.twig';
    }

    /**
     * @param string $templateFilter
     *
     * @return self
     */
    public function setTemplateFilter(string $templateFilter): self
    {
        $this->templateFilter = $templateFilter;

        return $this;
    }

    /**
     * @param bool $filterable
     * @return self
     */
    public function useFilterable(bool $filterable): self
    {
        $this->filterable = $filterable;

        return $this;
    }

    /**
     * @param bool $quickSearch
     * @return self
     */
    public function useQuickSearch(bool $quickSearch): self
    {
        $this->quickSearch = $quickSearch;

        return $this;
    }

    public function isMultipleValues(): bool
    {
        return $this->multipleValues;
    }

    public function useMultipleValues(bool $multipleValues): ColumnFilter
    {
        $this->multipleValues = $multipleValues;
        $this->range = false;

        return $this;
    }
}
