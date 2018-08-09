'use strict';

const Chaincode = require('../lib/chaincode');
const { Stub } = require('fabric-shim');

require('chai').should();
const sinon = require('sinon');

describe('Chaincode', () => {

    describe('#Init', () => {

        it('should work', async () => {
            const cc = new Chaincode();
            const stub = sinon.createStubInstance(Stub);
            stub.getFunctionAndParameters.returns({ fcn: 'initFunc', params: [] });
            const res = await cc.Init(stub);
            res.status.should.equal(Stub.RESPONSE_CODE.OK);
        });

    });

    describe('#Invoke', async () => {
        let cc;
        let stub;
        let res;

        beforeEach(async () => {
            cc = new Chaincode();
            stub = sinon.createStubInstance(Stub);
            stub.getFunctionAndParameters.returns({ fcn: 'initFunc', params: [] });
            res = await cc.Init(stub);
        });

        it('should ping', async () => {
            stub.getFunctionAndParameters.returns({ fcn: 'invokeFunc', params: [] });
            res = await cc.Invoke(stub);
            res.status.should.equal(Stub.RESPONSE_CODE.OK);
        });

        it('should work for put', async () => {
            stub.getFunctionAndParameters.returns({ fcn: 'put', params: ['one', 'two'] });
            res = await cc.Invoke(stub);
            res.status.should.equal(Stub.RESPONSE_CODE.OK);
        });

        it('should handle an error when calling put', async () => {
            stub.getFunctionAndParameters.returns({ fcn: 'put', params: [] });
            res = await cc.Invoke(stub);
            res.status.should.equal(Stub.RESPONSE_CODE.ERROR);
        });

        it('should work for get', async () => {
            stub.getFunctionAndParameters.returns({ fcn: 'get', params: ['one'] });
            res = await cc.Invoke(stub);
            res.status.should.equal(Stub.RESPONSE_CODE.OK);
        });

    });

});
