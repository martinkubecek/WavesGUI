(function () {
    'use strict';

    /**
     * @param Base
     * @param {$rootScope.Scope} $scope
     * @param {IPollCreate} createPoll
     * @param {Waves} waves
     * @param user
     * @return {MyBalance}
     */
    const controller = function (Base, $scope, createPoll, waves, user) {

        class MyBalance extends Base {

            constructor() {
                super();
                /**
                 * @type {Array}
                 */
                this.balanceList = null;
                this.pending = true;
                this.headers = [
                    {
                        id: 'asset',
                        search: true,
                        sort: true,
                        valuePath: 'item.asset.displayName'
                    },
                    {
                        id: 'assetId',
                        sort: false,
                        title: { literal: 'directives.balance.assetId' },
                        valuePath: 'item.assetId'
                    },
                    {
                        id: 'available',
                        sort: true,
                        title: { literal: 'directives.balance.available' },
                        valuePath: 'item.available'
                    },
                    {
                        id: 'inOrders',
                        sort: true,
                        title: { literal: 'directives.balance.inOrdersFull' },
                        valuePath: 'item.inOrders'
                    },
                    {
                        id: 'total',
                        sort: true,
                        title: { literal: 'directives.balance.total' },
                        valuePath: 'item.regular'
                    }
                ];

                const isBalance = true;
                createPoll(this, this._getBalanceList, 'balanceList', 1000, { $scope, isBalance }).ready
                    .then(() => {
                        this.pending = false;
                    });
            }

            /**
             * @param {string} assetId
             */
            setPair(assetId) {
                user.setSetting('dex.assetIdPair', {
                    amount: user.getSetting('dex.watchlist.baseAssetId'),
                    price: assetId
                });
            }

            /**
             * @return {Promise<IBalanceDetails[]>}
             * @private
             */
            _getBalanceList() {
                return waves.node.assets.userBalances()
                    .then((list) => list.filter(MyBalance._isNotScam));
            }

            /**
             * @param {IBalanceItem} item
             * @return {boolean}
             * @private
             */
            static _isNotScam(item) {
                return !WavesApp.scam[item.asset.id];
            }

        }

        return new MyBalance();
    };

    controller.$inject = ['Base', '$scope', 'createPoll', 'waves', 'user'];

    angular.module('app.dex').component('wDexMyBalance', {
        bindings: {},
        templateUrl: 'modules/dex/directives/myBalance/myBalance.html',
        transclude: false,
        controller
    });
})();