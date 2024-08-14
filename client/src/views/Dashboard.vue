<!-- src/views/Dashboard.vue -->
<template>
  <div class="content">
    <h1>Mes groupes</h1>
    <div v-if="this.groups.length > 0">
      <div v-for="(group, index) in this.groups" :key="index">
        <p>{{ group.group_id }} {{ group.group_name }}</p>
      </div>
    </div>
    <div v-else>
      <p>Chargement des données ... (ou aucune donnée)</p>
    </div>

  </div>
</template>

<script>
import { instance as axios } from '../services/axios'
export default {
  name: 'groups',
  data() {
    return {
      groups: [],
    }
  },
  mounted() {
    this.getGroups()
  },
  methods: {
    getGroups() {
      const token = localStorage.token;
      if (!token) {
        throw new Error('No token found');
      }

      axios.get('/user/groups')
        .then(res => {
          this.groups = res.data
        }).catch(error => {
          console.error('Error fetching groups:', error);
        })
    }
  }
};
</script>

<style scoped>
.content {
  margin-top: 70px;
}

h1 {
  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #f4f4f4;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>