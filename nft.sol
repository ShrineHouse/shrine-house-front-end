// SPDX-License-Identifier: MIT

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity >=0.7.0 <0.9.0;

contract nftFactory{
    using Strings for uint256;
    address[] public beatPacks;
    
    string baseURI;
    string public baseExtension = ".json";

    address public artist;
    uint256 public producerFee;
    uint256 public artistFee;
     uint256 public cost;
    uint256 public maxSupply;


    function createBeatpack(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        uint256 _producerFee,
        uint256 _artistFee,
        address _artist,
        uint256 _cost,
        uint256 _maxSupply

    ) public {
        address newPack = address(

        new beatPack(
        _name,
        _symbol,
        _initBaseURI,
        _producerFee,
        _artistFee,
        _artist, 
        _cost,
        _maxSupply
        ));

        beatPacks.push(newPack);

    } 
function getBeatPacks() public view returns (address[] memory) {
        return beatPacks;
    }
    
}

contract beatPack is ERC721Enumerable, Ownable {
    using Strings for uint256;

 
    string baseURI;
    string public baseExtension = ".json";

    address public artist;
    uint256 public producerFee;
    uint256 public artistFee;
     uint256 public cost;
    uint256 public maxSupply;

    event Sale(address from, address to, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        uint256 _producerFee,
        uint256 _artistFee,
        address _artist,
        uint256 _cost,
        uint256 _maxSupply
        
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        artistFee = _artistFee;
        producerFee = _producerFee;
        artist = _artist;
    }

    // Public functions
    function mint() public payable {
        uint256 supply = totalSupply();
        require(supply <= maxSupply);

        if (msg.sender != owner()) {
            require(msg.value >= cost);


            uint256 artistRoyalty = (msg.value * artistFee) / 100;
            uint256 producerRoyalty = (msg.value * producerFee) / 100;
            _payArtistRoyalities(artistRoyalty, producerRoyalty);

            uint256 royalty = artistRoyalty + producerRoyalty;

            (bool success2, ) = payable(owner()).call{
                value: (msg.value - royalty)
            }("");
            require(success2);
        }

        _safeMint(msg.sender, supply + 1);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        if (msg.value > 0) {
        
            uint256 artistRoyalty = (msg.value * artistFee) / 100;
            uint256 producerRoyalty = (msg.value * producerFee) / 100;
            _payArtistRoyalities(artistRoyalty, producerRoyalty);

            uint256 royalty = artistRoyalty + producerRoyalty;


            (bool success2, ) = payable(from).call{value: msg.value - royalty}(
                ""
            );
            require(success2);

            emit Sale(from, to, msg.value);
        }

        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override {
        if (msg.value > 0) {
            
            uint256 artistRoyalty = (msg.value * artistFee) / 100;
            uint256 producerRoyalty = (msg.value * producerFee) / 100;
            _payArtistRoyalities(artistRoyalty, producerRoyalty);

            uint256 royalty = artistRoyalty + producerRoyalty;


            (bool success2, ) = payable(from).call{value: msg.value - royalty}(
                ""
            );
            require(success2);

            emit Sale(from, to, msg.value);
        }

        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public payable override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        if (msg.value > 0) {
            uint256 artistRoyalty = (msg.value * artistFee) / 100;
            uint256 producerRoyalty = (msg.value * producerFee) / 100;
            _payArtistRoyalities(artistRoyalty, producerRoyalty);

            uint256 royalty = artistRoyalty + producerRoyalty;


            (bool success2, ) = payable(from).call{value: msg.value - royalty}(
                ""
            );
            require(success2);

            emit Sale(from, to, msg.value);
        }

        _safeTransfer(from, to, tokenId, _data);
    }

    // Internal functions
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _payArtistRoyalities(uint256 _artistFee, uint256 _producerFee) internal {
        (bool success1, ) = payable(artist).call{value: _artistFee}("");
        (bool success2, ) = payable(artist).call{value: _producerFee}("");
        require(success1);
        require(success2);
    }


    // Owner functions
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setRoyalityFees(uint256 _artistFee, uint256 _producerFee) public onlyOwner {
        artistFee = _artistFee;
        producerFee = _producerFee;
    }
}