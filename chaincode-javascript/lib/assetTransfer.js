/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const lands = [
            {
                SiteID: 'land1',
                SurveyID: 'survey1',
                PreviousOwnerName: 'Alice',
                PreviousOwnerAadhar: '123456789012',
                PreviousOwnerPan: 'ABCDE1234F',
                CurrentOwnerName: 'Bob',
                CurrentOwnerAadhar: '987654321098',
                CurrentOwnerPan: 'XYZAB9876C',
                SiteAddress: '123 Main St',
                Latitude: '12.9715987',
                Longitude: '77.594566',
                Area: '1000',
                Length: '50',
                Breadth: '20',
                DocumentHash: 'hash1',
            },
            {
                SiteID: 'land2',
                SurveyID: 'survey2',
                PreviousOwnerName: 'Charlie',
                PreviousOwnerAadhar: '234567890123',
                PreviousOwnerPan: 'BCDEF2345G',
                CurrentOwnerName: 'Dave',
                CurrentOwnerAadhar: '876543210987',
                CurrentOwnerPan: 'YZABC8765D',
                SiteAddress: '456 Elm St',
                Latitude: '13.0826802',
                Longitude: '80.2707184',
                Area: '2000',
                Length: '100',
                Breadth: '20',
                DocumentHash: 'hash2',
            },
            {
                SiteID: 'land3',
                SurveyID: 'survey3',
                PreviousOwnerName: 'Eve',
                PreviousOwnerAadhar: '345678901234',
                PreviousOwnerPan: 'CDEFG3456H',
                CurrentOwnerName: 'Frank',
                CurrentOwnerAadhar: '765432109876',
                CurrentOwnerPan: 'ZABCD7654E',
                SiteAddress: '789 Oak St',
                Latitude: '19.076090',
                Longitude: '72.877426',
                Area: '1500',
                Length: '75',
                Breadth: '20',
                DocumentHash: 'hash3',
            },
            {
                SiteID: 'land4',
                SurveyID: 'survey4',
                PreviousOwnerName: 'Grace',
                PreviousOwnerAadhar: '456789012345',
                PreviousOwnerPan: 'DEFGH4567I',
                CurrentOwnerName: 'Heidi',
                CurrentOwnerAadhar: '654321098765',
                CurrentOwnerPan: 'ABCDE6543F',
                SiteAddress: '101 Pine St',
                Latitude: '28.704060',
                Longitude: '77.102493',
                Area: '2500',
                Length: '125',
                Breadth: '20',
                DocumentHash: 'hash4',
            },
            {
                SiteID: 'land5',
                SurveyID: 'survey5',
                PreviousOwnerName: 'Ivan',
                PreviousOwnerAadhar: '567890123456',
                PreviousOwnerPan: 'EFGHI5678J',
                CurrentOwnerName: 'Judy',
                CurrentOwnerAadhar: '543210987654',
                CurrentOwnerPan: 'BCDEF5432G',
                SiteAddress: '202 Cedar St',
                Latitude: '22.572646',
                Longitude: '88.363895',
                Area: '3000',
                Length: '150',
                Breadth: '20',
                DocumentHash: 'hash5',
            },
            {
                SiteID: 'land6',
                SurveyID: 'survey6',
                PreviousOwnerName: 'Mallory',
                PreviousOwnerAadhar: '678901234567',
                PreviousOwnerPan: 'FGHIJ6789K',
                CurrentOwnerName: 'Niaj',
                CurrentOwnerAadhar: '432109876543',
                CurrentOwnerPan: 'CDEFG4321H',
                SiteAddress: '303 Birch St',
                Latitude: '13.067439',
                Longitude: '80.237617',
                Area: '3500',
                Length: '175',
                Breadth: '20',
                DocumentHash: 'hash6',
            },
        ];

        for (const land of lands) {
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            await ctx.stub.putState(land.SiteID, Buffer.from(stringify(sortKeysRecursive(land))));
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async createLand(ctx, siteId, surveyId, previousOwnerName, previousOwnerAadhar, previousOwnerPan, currentOwnerName, currentOwnerAadhar, currentOwnerPan, siteAddress, latitude, longitude, area, length, breadth, documentHash) {
        const exists = await this.AssetExists(ctx, siteId);
        if (exists) {
            throw new Error(`The land with site ID ${siteId} already exists`);
        }

        const land = {
            SiteID: siteId,
            SurveyID: surveyId,
            PreviousOwnerName: previousOwnerName,
            PreviousOwnerAadhar: previousOwnerAadhar,
            PreviousOwnerPan: previousOwnerPan,
            CurrentOwnerName: currentOwnerName,
            CurrentOwnerAadhar: currentOwnerAadhar,
            CurrentOwnerPan: currentOwnerPan,
            SiteAddress: siteAddress,
            Latitude: latitude,
            Longitude: longitude,
            Area: area,
            Length: length,
            Breadth: breadth,
            DocumentHash: documentHash,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(siteId, Buffer.from(stringify(sortKeysRecursive(land))));
        return JSON.stringify(land);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async getLand(ctx, siteId) {
        const landJSON = await ctx.stub.getState(siteId); // get the land from chaincode state
        if (!landJSON || landJSON.length === 0) {
            throw new Error(`The land with site ID ${siteId} does not exist`);
        }
        return landJSON.toString();
    }

    // updateLand updates an existing land record in the world state with provided parameters.
    async updateLand(ctx, siteId, surveyId, previousOwnerName, previousOwnerAadhar, previousOwnerPan, currentOwnerName, currentOwnerAadhar, currentOwnerPan, siteAddress, latitude, longitude, area, length, breadth, documentHash) {
        const exists = await this.AssetExists(ctx, siteId);
        if (!exists) {
            throw new Error(`The land with site ID ${siteId} does not exist`);
        }

        // overwriting original land record with new land record
        const updatedLand = {
            SiteID: siteId,
            SurveyID: surveyId,
            PreviousOwnerName: previousOwnerName,
            PreviousOwnerAadhar: previousOwnerAadhar,
            PreviousOwnerPan: previousOwnerPan,
            CurrentOwnerName: currentOwnerName,
            CurrentOwnerAadhar: currentOwnerAadhar,
            CurrentOwnerPan: currentOwnerPan,
            SiteAddress: siteAddress,
            Latitude: latitude,
            Longitude: longitude,
            Area: area,
            Length: length,
            Breadth: breadth,
            DocumentHash: documentHash,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(siteId, Buffer.from(stringify(sortKeysRecursive(updatedLand))));
    }

    // DeleteAsset deletes an given asset from the world state.
    async deleteLand(ctx, siteId) {
        const exists = await this.AssetExists(ctx, siteId);
        if (!exists) {
            throw new Error(`The land with site ID ${siteId} does not exist`);
        }
        return ctx.stub.deleteState(siteId);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, siteId) {
        const assetJSON = await ctx.stub.getState(siteId);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferLand updates the owner fields of land with given siteId in the world state.
    async TransferLand(ctx, siteId, newOwnerName, newOwnerAadhar, newOwnerPan) {
        const landString = await this.getLand(ctx, siteId);
        const land = JSON.parse(landString);

        // Update previous owner details
        land.PreviousOwnerName = land.CurrentOwnerName;
        land.PreviousOwnerAadhar = land.CurrentOwnerAadhar;
        land.PreviousOwnerPan = land.CurrentOwnerPan;

        // Update current owner details
        land.CurrentOwnerName = newOwnerName;
        land.CurrentOwnerAadhar = newOwnerAadhar;
        land.CurrentOwnerPan = newOwnerPan;

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(siteId, Buffer.from(stringify(sortKeysRecursive(land))));
        return JSON.stringify(land);
    }

    // GetAllLands returns all lands found in the world state.
    async GetAllLands(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all lands in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // GetLandHistory returns the chain of custody for a land since issuance.
    async GetLandHistory(ctx, siteId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(siteId);
        let results = await this._GetAllResults(resultsIterator, true);
        return JSON.stringify(results);
    }

    async _GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }
}

module.exports = AssetTransfer;
