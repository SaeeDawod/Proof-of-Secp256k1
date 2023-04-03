const { createHash } = require('crypto');
const elliptic = require('elliptic');
const ethers = require('ethers')

const proveCurve = async () => {
    //Replace the Provider RPC link with your besu node rpc
    const providerRPC = "https://demo-5ad6.settlemint.com/bpaas-eF3544E753cCe5E8C022DE667368ACdED2529695"
    const provider = ethers.getDefaultProvider(providerRPC);
    const block = await provider.getBlock('latest', true);
    const extraData = block.extraData;

    let curveName;

    const ecSecp256k1 = new elliptic.ec("secp256k1");
    const ecSecp256r1 = new elliptic.ec("p256");
    // Calculate the hash of the extra data
    const hash = createHash('sha256').update(extraData).digest();
    // Derive the public key from the hash using the curve
    let publicKey = ecSecp256k1.recoverPubKey(hash, { r: extraData.slice(2, 66), s: extraData.slice(66, 130) }, 0).encode('hex', true);

    if (ecSecp256k1.keyFromPublic(publicKey, "hex").getPublic().encodeCompressed("hex") === publicKey) {
        curveName = "secp256k1";
    } else {
        publicKey = ecSecp256r1.recoverPubKey(hash, { r: extraData.slice(2, 66), s: extraData.slice(66, 130) }, 0).encode('hex', true);
        if (ecSecp256r1.keyFromPublic(publicKey, "hex").getPublic().encodeCompressed("hex") === publicKey) {
            curveName = "secp256r1";
        }
        else {
            console.log('not a curve?/different curve used');
        }
    }
    console.log("The curve used is " + curveName + ".");
}

proveCurve()

