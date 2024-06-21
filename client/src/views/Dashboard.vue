<!-- src/views/Dashboard.vue -->
<template>
    <div>
      <h1>Dashboard</h1>
      <ul v-if="groups.length">
        <li v-for="group in groups">
          {{ group.group_name }}
        </li>
      </ul>
      <p v-else>Aucun groupe trouvé.</p>
    </div>
  </template>
  
<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {


    /*
  setup() {
    let groups;
    const fetchGroups = async () => {
      try {
        const token = localStorage.token;
        console.log(token)
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:20241/user/groups', {
          headers: {
            Authorization: token
          }
        });


        groups = response.data
        console.log(groups)
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes:', error);
      }
    };

    onMounted(() => {
      fetchGroups();
    });

    return {
      groups
    };
  }
  */
};
</script>
  
  <style scoped>
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
  