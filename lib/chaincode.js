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

const shim = require('fabric-shim');

class Chaincode {

    async Init(stub) {
        const { fcn, params } = stub.getFunctionAndParameters();
        console.info('Init()', fcn, params);
        return shim.success();
    }

    async Invoke(stub) {
        const { fcn, params } = stub.getFunctionAndParameters();
        console.info('Invoke()', fcn, params);

        switch(fcn) {
        case 'put':
            return await this.put(stub, params[0], params[1]);
        case 'get':
            return await this.get(stub, params[0]);
        default:
            return this.ping();
        }

    }

    ping() {
        return shim.success();
    }

    async put(stub, key, value) {
        try {
            await stub.putState(key, Buffer.from(value));
        } catch (error) {
            return shim.error(error);
        }
        return shim.success(JSON.stringify({key, value}));
    }

    async get(stub, key) {
        const result = await stub.getState(key);
        return shim.success(result);
    }

}

module.exports = Chaincode;
