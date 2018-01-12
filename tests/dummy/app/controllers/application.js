import Ember from 'ember';

const {
    Controller,
    Logger
} = Ember;

export default Controller.extend({

    init() {
        this._super(...arguments);
        let array = [{
            name: 'TRANSACTION DATE',
            content: ['TXN00002', 'TXN00003', 'TXN00004', 'TXN00005']
        }, {
            name: 'VALUE DATE',
            content: ['TXN00002', 'TXN00003', 'TXN00004', 'TXN00005']
        }, {
            name: 'TRANSACTION REFERENCE',
            content: ['TXN00002', 'TXN00003', 'TXN00004', 'TXN00005']
        }];

        this.set('someArray', array);
    },

    actions: {
        itemMoved(item) {
            Logger.log(item);
        }
    }
});