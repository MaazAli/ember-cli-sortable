import Ember from 'ember';

const { 
    Route
} = Ember;

export default Route.extend({
    model() {
        let array = [
            {
                name: 'TRANSACTION REFERENCE',
                content: ['TX00001', 'TX00002', 'TX00003', 'TX00004']
            },
            {
                name: 'VALUE DATE',
                content: ['TX00001', 'TX00002', 'TX00003', 'TX00004']
            }
        ];

        return array;
    }
})