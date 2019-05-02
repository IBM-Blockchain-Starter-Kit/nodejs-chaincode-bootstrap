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

'use strict';

const { Contract } = require('fabric-contract-api');

class MyContract extends Contract {

    async instantiate(ctx) {
        console.log('entering >>> instantiate');
    }

    async ping(ctx) {
        console.log('entering >>> ping');
        return 'Ping to chaincode successful';
    }

    async put(ctx, key, value) {
        console.info('entering >>> put');
        try {
            await ctx.stub.putState(key, Buffer.from(value));
            return JSON.stringify({[key]: value});
        } catch (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }

    async get(ctx, key) {
        console.info('entering >>> get');
        try {
            const value = await ctx.stub.getState(key);
            return value.toString();
        } catch (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}

module.exports = MyContract;
