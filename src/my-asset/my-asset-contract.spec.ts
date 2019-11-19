/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { MyAssetContract } from '..';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('MyAssetContract', () => {

    let contract: MyAssetContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new MyAssetContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my asset 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my asset 1002 value"}'));
    });

    describe('#ping', () => {

      it('should ping successfully', async () => {
          const result = await contract.ping(ctx);
          result.should.equal('Ok');
      });

    });

    describe('#myAssetExists', () => {

        it('should return true for a my asset', async () => {
            const result = await contract.myAssetExists(ctx, '1001');
            result.should.equal(true);
        });

        it('should return false for a my asset that does not exist', async () => {
            const result = await contract.myAssetExists(ctx, '1003');
            result.should.equal(false);
        });

    });

    describe('#createMyAsset', () => {

        it('should create a my asset', async () => {
            const result = await contract.createMyAsset(ctx, '1003', 'my asset 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"my asset 1003 value"}'));
            result.should.deep.equal({ value: 'my asset 1003 value' });
        });

        it('should throw an error for a my asset that already exists', async () => {
            await contract.createMyAsset(ctx, '1001', 'myvalue').should.be.rejectedWith(/The my asset 1001 already exists/);
        });

    });

    describe('#getMyAsset', () => {

        it('should return a my asset', async () => {
            const result = await contract.getMyAsset(ctx, '1001');
            result.should.deep.equal({ value: 'my asset 1001 value' });
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.getMyAsset(ctx, '1005').should.be.rejectedWith(/The my asset 1005 does not exist/);
        });

    });

    describe('#updateMyAsset', () => {

        it('should update a my asset', async () => {
            const result = await contract.updateMyAsset(ctx, '1001', 'my asset 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"my asset 1001 new value"}'));
            result.should.deep.equal({ value: 'my asset 1001 new value' });
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.updateMyAsset(ctx, '1005', 'my asset 1005 new value').should.be.rejectedWith(/The my asset 1005 does not exist/);
        });

    });

    describe('#deleteMyAsset', () => {

        it('should delete a my asset', async () => {
            const result = await contract.deleteMyAsset(ctx, '1001');
            result.should.equal('1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a my asset that does not exist', async () => {
            await contract.deleteMyAsset(ctx, '1005').should.be.rejectedWith(/The my asset 1005 does not exist/);
        });

    });

});
