<!-- src/views/Dashboard.vue -->
<template>
  <div class="background">
    <div class="spacing"></div>
    <div class="dashboard">
      <div class="group-container">
        <div class="buttons-container">
          <h1>Vos groupes</h1>
          <div class="buttons">
            <button @click="createGroup()" class="action-button">
              Créer un groupe
            </button>
            <button @click="joinGroup()" class="action-button">
              Rejoindre un groupe
            </button>
          </div>
        </div>
        <div v-if="groups.length > 0" class="container">
          <div v-for="group in displayedGroups" :key="group.group_id" class="card">
            <div class="card-infos">
              <h3>{{ group.group_name }}</h3>
              <p>Nombre de personnes: {{ group.user_count }}</p>
              <p>Listes actives: {{ group.active_list_count }}</p>
            </div>
            <div class="card-footer">
              <button @click="goToGroupPage(group.group_id)" class="go-to-button">
                Voir le groupe
              </button>
            </div>
          </div>
        </div>

        <div v-else>
          <p>
            Vous n'avez aucun groupe. Vous pouvez en créer ou en rejoindre un pour commencer
            !
          </p>
        </div>
      </div>

      <div class="list-container">
        <div class="buttons-container">
          <h1>Vos listes</h1>
        </div>

        <div v-if="lists.length > 0" class="container">
          <div v-for="list in displayedLists" :key="list.list_id" class="card">
            <div class="card-infos">
              <h3>{{ list.list_name }}</h3>
              <p>{{ list.group_name }}</p>
              <p>Date de course prévu: {{ formatDate(list.shopping_date) }}</p>
              <p>{{ list.supermarket_name }}</p>
            </div>
            <div class="card-footer">
              <button @click="goToListPage(list.group_id, list.list_id)" class="go-to-button">Voir la liste</button>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Vous n'avez aucune liste. Commencez par créer un groupe.</p>
        </div>

      </div>
    </div>

    <div class="spacing"></div>
    <!--
      
      -->
  </div>

  <div v-if="isCreating" class="modal">
    <div class="modal-content">
      <h2>Nommez votre groupe</h2>
      <input v-model="group_name" placeholder="Nouveau nom du groupe" />
      <button @click="submitGroup">Enregistrer</button>
      <button @click="cancelGroupCreate">Annuler</button>
    </div>
  </div>

  <div v-if="isJoining" class="modal">
    <div class="modal-content">
      <h2>Indiquez le code du groupe</h2>
      <input v-model="invitation_code" placeholder="Code d'invitation" />
      <button @click="joiningGroup">Rejoindre</button>
      <button @click="cancelGroupJoin">Annuler</button>
    </div>
  </div>
</template>

<script>
import { instance as axios } from "../services/axios";
import { useRouter } from "vue-router";

export default {
  name: "Dashboard",
  data() {
    return {
      groups: [],
      displayedGroups: [],
      lists: [],
      displayedLists: [],
      group_name: null,
      invitation_code: null,
      isCreating: false,
      isJoining: false,
    };
  },
  mounted() {
    this.getGroups();
    this.getLists();
  },
  methods: {
    async getGroups() {
      try {
        const response = await axios.get("/user/groups");
        this.groups = response.data.map((group) => ({
          ...group,
          user_count: Math.floor(Math.random() * 10),
          active_list_count: Math.floor(Math.random() * 10),
        }));
        this.displayedGroups = this.groups.slice(0, 9);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    },
    async getLists() {
      try {
        const response = await axios.get("/user/lists");
        this.lists = response.data.map((list) => ({
          ...list,
          item_count: Math.floor(Math.random() * 20),
        }));
        this.displayedLists = this.lists.slice(0, 9);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("fr-FR", options);
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
        const response = await axios.post("/user/groups", {
          group_name: this.group_name,
        });
        this.isCreating = false;
        this.$router.push(`/group/${response.data.group_id}`);
      } catch (error) {
        console.error("Error creating group:", error);
        alert("Une erreur est survenue lors de la création du groupe.");
      }
    },

    async joiningGroup() {
      try {
        const response = await axios.post("/user/users/joingroup", {
          invitation_code: this.invitation_code,
        });

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
            alert(
              "Une erreur est survenue: " + error.response.data.message || error.message
            );
          }
        } else if (error.request) {
          alert("Aucune réponse du serveur. Veuillez vérifier votre connexion.");
        } else {
          alert("Erreur: " + error.message);
        }

        this.isJoining = false;
        //console.error('Erreur lors de la tentative de rejoindre le groupe:', error);
      }
    },
  },
};
</script>

<style scoped>
.background {
  height: 100vh;
  margin: 0;
  background-color: white;
  display: flex;
}

.spacing {
  display: block;
  width: 15%;
}

.dashboard {
  padding-top: 60px;
  width: 70%;
}

.buttons-container {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  display: flex;
  gap: 20px;
  height: 5vh;
}

.action-button {
  background-color: white;
  border: 2px solid #2c7c45;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}

.action-button:hover {
  background-color: #2c7c45;
  color: white
}

.container {
  display: flex;
  flex-direction: row;
  align-content: center;
  height: 30vh;
}

.card {
  background: white;
  width: 20%;
  margin: 1rem;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 10px 0px;
  border: solid 2px #2c7c45;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-infos {
  height: 20px;
  padding: 1rem;
}

.card-footer {
  background-color: #e0e0e0;
  padding: 20px;
  border-radius: 0 0 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card h3 {
  margin: 0 0 0.5rem 0;
  font-weight: bold;
}

.card p {
  margin: 0.2rem 0;
}

.go-to-button {
  background-color: white;
  padding: 5px;
  width: 70%;
  border: 2px solid #2c7c45;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.go-to-button:hover {
  background-color: #2c7c45;
  color: white
}

.modal {
  width: 30%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: solid 2px #2c7c45;
  box-shadow: #0000004d 0px 0px 50px 0px;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-content h2 {
  margin-bottom: 15px;
}

.modal-content input {
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
}

.modal-content button {
  width: 100%;
  padding: 10px;
  background-color: #2C7C45;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.modal-content button:hover {
  background-color: #2C7C45;
  color: white;
}

@media (max-width:1444px) {
  .card-infos {
    height: 20%;
  }

  .card-footer {
    padding: 10px;
  }

  .card {
    width: 25%;
  }
}

@media (max-width:1244px) {
  .modal {
    width: 50%;
  }

  .spacing {
    width: 5%;
  }

  .dashboard {
    width: 90%;
  }

  .card-infos {
    height: 20%;
  }

  .card-footer {
    padding: 10px;
  }

  .container {
    justify-content: space-between;
  }

  .card {
    width: 45%;
  }
}

@media (max-width: 768px) {
  .modal {
    width: 90%;
  }

  .spacing {
    display: none;
  }

  .group-container, .list-container{
    height: 70%;
  }
  .buttons {
    gap: 10px;
    display: flex;
    justify-content: center;
  }

  .buttons-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard {
    width: 100%;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 80%;
    height: 100vh;
  }

  .card-infos {
    height: 20%;
  }

  .card-footer {
    padding: 10px;
  }
}
</style>
