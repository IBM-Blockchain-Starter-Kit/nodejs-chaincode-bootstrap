'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { Context } = require('fabric-contract-api');
const { MyContract } = require('..');

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

class TestContext extends Context {

    constructor() {
        super();
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.stub.getState = sinon.stub().returns(Buffer.from('value1'));
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
    }

}

class TestContextError extends Context {

    constructor() {
        super();
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.stub.getState = sinon.stub().throws(new Error('error from stub getState'));
        this.stub.putState = sinon.stub().throws(new Error('error from stub putState'));
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
    }

}

describe('MyContract', () => {

    describe('#instantiate', () => {

        it('should be successful', async () => {
            const contract = new MyContract();
            const ctx = new TestContext();
            await contract.instantiate(ctx);
        });

    });

    describe('#ping', () => {

        it('should return success message', async () => {
            const contract = new MyContract();
            const ctx = new TestContext();
            const result = await contract.ping(ctx, 'ping');
            result.should.equal('Ping to chaincode successful');
        });

    });

    describe('#put', () => {

        it('should return kv object', async () => {
            const contract = new MyContract();
            const ctx = new TestContext();
            const result = await contract.put(ctx, 'key1', 'value1');
            const parsedResult = JSON.parse(result);
            parsedResult.should.deep.equal({
                key1: 'value1'
            });
        });

        it('should handle error from stub', async () => {
            const contract = new MyContract();
            const ctx = new TestContextError();
            return contract.put(ctx, 'key1', 'value1').should.be.rejectedWith(Error);
        });

    });

    describe('#get', () => {

        it('should return value of key', async () => {
            const contract = new MyContract();
            const ctx = new TestContext();
            const result = await contract.get(ctx, 'key1');
            result.should.equal('value1');
        });

        it('should handle error from stub', async () => {
            const contract = new MyContract();
            const ctx = new TestContextError();
            return contract.get(ctx, 'key1').should.be.rejectedWith(Error);
        });

    });

});
