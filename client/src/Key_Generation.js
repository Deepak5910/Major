class VirtualPUF {
    constructor(numStages) {
        this.numStages = numStages;
    }

    generateChallenge() {
        const challenge = [];
        for (let i = 0; i < this.numStages; i++) {
            challenge.push(Math.round(Math.random()));
        }
        return challenge;
    }

    computeResponse(challenge) {
        const halfLength = Math.floor(challenge.length / 2);
        const half1 = challenge.slice(0, halfLength);
        const half2 = challenge.slice(halfLength);

        // Compute XOR of the bits in each half
        const xor1 = half1.reduce((acc, curr) => acc ^ curr);
        const xor2 = half2.reduce((acc, curr) => acc ^ curr);

        // Calculate response as the XOR of xor1 and xor2
        const response = xor1 ^ xor2;
        return response;
    }

    generatePUFKey(challenge, response) {
        // Concatenate challenge and response
        const challengeResponseConcatenated = challenge.concat([response]);

        // Apply SHA-256 hash function
        const hash = crypto.createHash('sha256');
        hash.update(Buffer.from(challengeResponseConcatenated));
        const key = hash.digest('hex');
        return key;
    }
}
const numStages = 16;
