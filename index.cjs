// Import required modules
const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const { mplTokenMetadata, createMetadataAccountV3 } = require("@metaplex-foundation/mpl-token-metadata");
const { keypairIdentity, generateSigner, publicKey } = require("@metaplex-foundation/umi");
const fs = require("fs");

// Initialize Umi with a connection to the Solana cluster (Devnet for testing)
const umi = createUmi("https://api.devnet.solana.com");

// Set up a keypair identity for signing transactions
const signer = generateSigner(umi);
umi.use(keypairIdentity(signer));

// Add the token metadata plugin
umi.use(mplTokenMetadata());

// Define metadata object
const metadata = {
  name: "GodCoin",
  symbol: "GOD",
  uri: "https://raw.githubusercontent.com/ant-a11y/God-Coin/main/god-coin%20IMAGE.png",
  sellerFeeBasisPoints: 500, // Example: 5% royalty
  creators: [
    {
      address: publicKey("AJQCTPAJHF7uQyazt7E5gEmynRHDcpVH4mVwoMWtSNcA"), // Fix applied
      share: 100,
    },
  ],
};

// Function to set up token metadata
async function setUpTokenMetadata(umi) {
  try {
    const metadataAccount = await createMetadataAccountV3(umi, {
      mint: signer.publicKey, // Using signer's public key
      metadata: metadata, // Pass the metadata object here
      isMutable: true,
    }).sendAndConfirm(umi);

    console.log("Metadata created:", metadataAccount);
    return metadataAccount;
  } catch (error) {
    console.error("Error setting up token metadata:", error);
  }
}

// Execute the function
setUpTokenMetadata(umi).catch(console.error);
