<?php

namespace Spipu\UiBundle\Entity;

use Spipu\UiBundle\Repository\GridConfigRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=GridConfigRepository::class)
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(
 *     name="spipu_ui_grid_config",
 *     indexes={
 *         @ORM\Index(name="search_idx", columns={"grid_identifier", "user_identifier"})
 *     }
 * )
 */
class GridConfig
{
    use TimestampableTrait;

    /**
     * @var int|null
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     */
    private $gridIdentifier;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     */
    private $userIdentifier;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @var array
     * @ORM\Column(type="json")
     */
    private $config = [];

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getGridIdentifier(): string
    {
        return $this->gridIdentifier;
    }

    /**
     * @param string $gridIdentifier
     * @return $this
     */
    public function setGridIdentifier(string $gridIdentifier): self
    {
        $this->gridIdentifier = $gridIdentifier;

        return $this;
    }

    /**
     * @return string
     */
    public function getUserIdentifier(): string
    {
        return $this->userIdentifier;
    }

    /**
     * @param string $userIdentifier
     * @return $this
     */
    public function setUserIdentifier(string $userIdentifier): self
    {
        $this->userIdentifier = $userIdentifier;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return array
     */
    public function getConfig(): array
    {
        return $this->config;
    }

    /**
     * @param array $config
     * @return $this
     */
    public function setConfig(array $config): self
    {
        $this->config = $config;

        return $this;
    }
}
