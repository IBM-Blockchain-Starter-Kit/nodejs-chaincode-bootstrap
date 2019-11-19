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

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import Logger from '../util/logger';
import { MyAsset } from './my-asset';

const logger = Logger.getLogger('MyAssetContract');

@Info({title: 'MyAssetContract', description: 'My Contract' })
export class MyAssetContract extends Contract {

    @Transaction()
    @Returns('string')
    public async ping(ctx: Context): Promise<string> {
        logger.debug('entering >>> ping');
        logger.debug('Ping to chaincode successful');
        return 'Ok';
    }

    @Transaction(false)
    @Returns('boolean')
    public async myAssetExists(ctx: Context, myAssetId: string): Promise<boolean> {
        logger.debug('entering >>> myAssetExists');

        const buffer = await ctx.stub.getState(myAssetId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createMyAsset(ctx: Context, myAssetId: string, value: string): Promise<MyAsset> {
        logger.debug('entering >>> createMyAsset');

        const exists = await this.myAssetExists(ctx, myAssetId);
        if (exists) {
            logger.error(`The my asset ${myAssetId} already exists`);
            throw new Error(`The my asset ${myAssetId} already exists`);
        }
        const myAsset = new MyAsset();
        myAsset.value = value;
        const buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(myAssetId, buffer);
        return myAsset;
    }

    @Transaction(false)
    @Returns('MyAsset')
    public async getMyAsset(ctx: Context, myAssetId: string): Promise<MyAsset> {
        logger.debug('entering >>> getMyAsset');

        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            logger.error(`The my asset ${myAssetId} does not exist`);
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(myAssetId);
        const myAsset = JSON.parse(buffer.toString()) as MyAsset;
        return myAsset;
    }

    @Transaction()
    public async updateMyAsset(ctx: Context, myAssetId: string, newValue: string): Promise<MyAsset> {
        logger.debug('entering >>> updateMyAsset');

        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            logger.error(`The my asset ${myAssetId} does not exist`);
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const myAsset = new MyAsset();
        myAsset.value = newValue;
        const buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(myAssetId, buffer);
        return myAsset;
    }

    @Transaction()
    public async deleteMyAsset(ctx: Context, myAssetId: string): Promise<string> {
        logger.debug('entering >>> deleteMyAsset');

        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            logger.error(`The my asset ${myAssetId} does not exist`);
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        await ctx.stub.deleteState(myAssetId);
        return myAssetId;
    }

}
