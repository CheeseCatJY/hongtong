import {item1, item2} from '~/static/data/summary';

export const state = () => ({
  item1: item1,
  item2: item2,
})

export const mutations = {
  setItem(state, {item, value}) {
    item.value = value
  },
}
