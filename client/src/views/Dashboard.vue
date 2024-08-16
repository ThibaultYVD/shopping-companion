<!-- src/views/Dashboard.vue -->
<template>
  <div class="background">
    <div class="dashboard">
      <div class="groups">
        <h1>Mes groupes</h1>
        <div v-if="groups.length > 0" class="groups-container">
          <div v-for="group in displayedGroups" :key="group.group_id" class="group-card">
            <h3>{{ group.group_name }}</h3>
            <p>Nombre de personnes: {{ group.user_count }}</p>
            <p>Listes actives: {{ group.active_list_count }}</p>
            <button @click="goToGroupPage(group.group_id)" class="group-button">Voir le groupe</button>
          </div>
        </div>
        <div v-else>
          <p>Vous n'avez aucun groupe. Vous pouvez en créer ou en rejoindre un pour commencer !</p>
        </div>
        <div class="create-group-container">
          <button @click="createGroup()" class="create-group-button">Créer un groupe</button>
          <button @click="joinGroup()" class="create-group-button">Rejoindre un groupe</button>
        </div>
      </div>
      <div class="lists">
        <h1>Mes listes</h1>
        <div v-if="lists.length > 0" class="lists-container">
          <div v-for="list in displayedLists" :key="list.list_id" class="list-card">
            <h3>{{ list.list_name }}</h3>
            <p>Nombre d'éléments: {{ list.item_count }}</p>
            <button @click="goToListPage(list.group_id, list.list_id)" class="list-button">Voir la liste</button>
          </div>
        </div>
        <div v-else>
          <p>Vous n'avez aucune liste. Commencez par créer un groupe.</p>
        </div>
      </div>
    </div>
  </div>



  <div v-if="isCreating" class="create-modal">
    <div class="modal-content">
      <h2>Nommez votre groupe</h2>
      <input v-model="group_name" placeholder="Nouveau nom du groupe" />
      <button @click="submitGroup">Enregistrer</button>
      <button @click="cancelGroupCreate">Annuler</button>
    </div>
  </div>

  <div v-if="isJoining" class="join-modal">
    <div class="modal-content">
      <h2>Indiquez le code du groupe</h2>
      <input v-model="invitation_code" placeholder="Code d'invitation" />
      <button @click="joiningGroup">Rejoindre</button>
      <button @click="cancelGroupJoin">Annuler</button>
    </div>
  </div>

</template>

<script>
import { instance as axios } from '../services/axios';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  data() {
    return {
      groups: [],
      displayedGroups: [],
      lists: [],
      displayedLists: [],
      group_name: null,
      invitation_code: null,
      isCreating: false,
      isJoining: false
    };
  },
  mounted() {
    this.getGroups();
    this.getLists();
  },
  methods: {
    async getGroups() {
      try {
        const response = await axios.get('/user/groups');
        this.groups = response.data.map(group => ({
          ...group,
          user_count: Math.floor(Math.random() * 10),
          active_list_count: Math.floor(Math.random() * 10)
        }));
        this.displayedGroups = this.groups.slice(0, 9);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    },
    async getLists() {
      try {
        const response = await axios.get('/user/lists');
        this.lists = response.data.map(list => ({
          ...list,
          item_count: Math.floor(Math.random() * 20)
        }));
        this.displayedLists = this.lists.slice(0, 9);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    },
    goToGroupPage(groupId) {
      this.$router.push(`/group/${groupId}`);
    },
    goToListPage(groupId, listId) {
      this.$router.push(`/group/${groupId}/list/${listId}`);
    },
    createGroup() {
      this.isCreating = true;
    },
    joinGroup() {
      this.isJoining = true;
    },
    cancelGroupCreate() {
      this.isCreating = false;
    },
    cancelGroupJoin() {
      this.isJoining = false;
    },

    async submitGroup() {
      try {
        const response = await axios.post('/user/groups', { group_name: this.group_name });
        this.isCreating = false;
        this.$router.push(`/group/${response.data.group_id}`);

      } catch (error) {
        console.error('Error creating group:', error);
        alert('Une erreur est survenue lors de la création du groupe.');
      }
    },

    async joiningGroup() {
      try {
        const response = await axios.post('/user/users/joingroup', { invitation_code: this.invitation_code });

        if (response.data.error === "Vous êtes déjà membre de ce groupe.") {
          alert("Vous êtes déjà membre de ce groupe.");
          this.isJoining = false;
          return;
        } else if (response.status === 403) {
          alert("Code d'invitation invalide.");
          this.isJoining = false;
          return;
        }

        if (response.data.group && response.data.group.group_id) {
          this.$router.push(`/group/${response.data.group.group_id}`);
        }

      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            alert("Code d'invitation invalide ou vous êtes déjà membre de ce groupe.");
          } else {
            alert('Une erreur est survenue: ' + error.response.data.message || error.message);
          }
        } else if (error.request) {
          alert('Aucune réponse du serveur. Veuillez vérifier votre connexion.');
        } else {
          alert('Erreur: ' + error.message);
        }

        this.isJoining = false;
        //console.error('Erreur lors de la tentative de rejoindre le groupe:', error);
      }
    }

  }
};
</script>

<style scoped>
.background {
  height: 100vh;
  margin: 0;
  background-color: white;
}

.dashboard {
  display: flex;
  padding-top: 50px;
}

.groups h1 {
  margin-top: 20px;
  padding-left: 8rem;
}

.lists h1 {
  margin-top: 20px;
  padding-left: 3rem;
}

.groups,
.lists {
  width: 50%;
}

.groups-container,
.lists-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.group-card,
.list-card {
  background: white;
  padding: 1rem;
  margin: 1rem;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.30) 0px 0px 10px 0px;
  border: solid 2px #2C7C45;
}

.group-card h3,
.list-card h3 {
  margin: 0 0 0.5rem 0;
  font-weight: bold;
}

.group-card p,
.list-card p {
  margin: 0.2rem 0;
}

.group-button,
.list-button,
.create-group-button {
  width: 100%;
  padding: 5px;
  background-color: white;
  border: solid 2px #2C7C45;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 15px;
  font-weight: 400;
}

.group-button:hover,
.list-button:hover,
.create-group-button:hover {
  background: #2C7C45;
  color: white;
}

.create-group-button {
  margin-top: 20px;
  border: 2px solid #2C7C45;
  background-color: white;
  width: 50%;
  padding: 15px;
}

.create-group-container {
  display: flexbox;
  justify-content: center;
  margin-top: 20px;
}

.create-modal,
.join-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: solid 2px #2C7C45;
  box-shadow: #0000004d 0px 0px 50px 0px;
  z-index: 1000;
}
</style>