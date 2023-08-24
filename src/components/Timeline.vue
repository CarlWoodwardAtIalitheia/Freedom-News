<script setup>
import TimelineUpdate from './TimelineUpdate.vue';
</script>

<template>
    <div class="timeline">
        <div class="line"></div>
        <div class="right">
            <div class="sorting">
                <div class="criteria">
                    <label>{{ $t('sorting.sortBy') }}</label>
                    <select v-model="criteria">
                        <option value="date">{{ $t('sorting.date') }}</option>
                    </select>
                </div>
                <div class="order">
                    <label>{{ $t('sorting.order') }}</label>
                    <select v-model="order">
                        <option :value="1">{{ $t('sorting.ascending') }}</option>
                        <option :value="-1">{{ $t('sorting.descending') }}</option>
                    </select>
                </div>
            </div>
            <div class="updates">
                <TimelineUpdate v-for="update of updates.toSorted((a, b) => order * criterion[criteria](a, b))"
                    :date="update.created_at" :category="update.tags[2][1]" :title="update.tags[1][1]" :id="update.id"
                    :pubkey="update.pubkey"></TimelineUpdate>
            </div>
        </div>
    </div>
    <br>
    <br>
</template>

<script>
export default {
    props: {
        updates: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            order: -1,
            criteria: 'date',
            criterion: {
                'date': (a, b) => a.created_at - b.created_at
            }
        };
    }
};
</script>

<style scoped>
@import url(../assets/css/Timeline.css);
</style>