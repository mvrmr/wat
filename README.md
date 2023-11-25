# wat
Whisper Asset Manager for Constellation

Transfer Asset from ETH <> MATIC

Smart Contracts needed

1. Ethereum (Sepolia)<br>
TokenETH - ERC20/ERC1155/ERC721<br>
EscrowETH - to lock & burn Token<br>
CCIPMsgContractETH - To send Msg across the CCIP network<br>
VerifierETH - To Verify ZK proof<br>

2. Polygon (Mumbai)<br>
TokenMAT - ERC20/ERC1155/ERC721<br>
EscrowMAT - to lock & burn Token<br>
CCIPMsgContractMAT - To send Msg across the CCIP network<br>
VerifierMAT - To verify ZK proof<br>


![Alt text](basic.jpg)
### Flow


RequestTransferMsg

    Rec => Sender

    Reciever send Transfer request with transferAmountHash

LockAssetMsg

    Sender => Rec
    Sender Takes TransferAmount and generates proof of balance and balanceAfter Transfer
    Sender Locks the asset in escrow Contract

MintAssetMsg

    Rec => Sender

BurnAssetMsg 

    Sender => Rec

RequestComplete

    Rec => Sender

