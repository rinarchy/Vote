import Vue from 'vue';

import Component from 'vue-class-component';

@Component
export default class inputControlSortOrder extends Vue {
    sortOrder = 'u'; // component local data

    changeSortOrder() { //method
        this.$store.commit('updateSortOrder', this.sortOrder);
        this.$store.commit('newCandidates');
    }
}
