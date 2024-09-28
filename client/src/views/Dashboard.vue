<!-- src/views/Dashboard.vue -->
<template>
  <div class="background">
    <Spacing />

    <div class="main-container">
      <div class="group-container">
        <CustomTitleSeparator title="Vos groupes" :buttons="groupButtons" />
      </div>

      <div class="center-container">
        <div v-if="groups.length > 0" class="container">
          <Card v-for="group in displayedGroups" :key="group.group_id" :title="group.group_name"
            :userCount="group.member_count" :activeListCount="group.list_count" :groupId="group.group_id"
            buttonText="Voir le groupe" @go-to-group="() => goToGroupPage(group.group_id)" />
        </div>

        <div v-else>
          <p>
            Vous n'avez aucun groupe. Vous pouvez en créer ou en rejoindre un pour commencer
            !
          </p>
        </div>

        <div class="list-container">
          <TitleSeparator title="Vos listes" />

          <div v-if="lists.length > 0" class="container">
            <Card v-for="list in displayedLists" :key="list.list_id" :title="list.list_name"
              :groupName="list.group_name" :shoppingDate="list.shopping_date" :supermarketName="list.supermarket_name"
              :listId="list.list_id" :groupId="list.group_id" buttonText="Voir la liste"
              @go-to-list="() => goToListPage(list.group_id, list.list_id)" />
          </div>
          <div v-else>
            <p>Vous n'avez aucune liste. Commencez par créer un groupe.</p>
          </div>

        </div>

      </div>
    </div>

    <Spacing />

  </div>


  <Modal :visible="isCreating" title="Créer un groupe" :actions="actionsCreate" @close="cancelGroupCreate">
    <template v-slot:body>
      <input v-model="group_name" class="modal-input" placeholder="Nom du groupe" />
    </template>
  </Modal>

  <Modal :visible="isJoining" title="Indiquez le code du groupe" :actions="actionsJoin" @close="cancelGroupJoin">
    <template v-slot:body>
      <input v-model="invitation_code" placeholder="Code d'invitation" />
    </template>
  </Modal>


</template>

<script>
import { instance as axios } from "../services/axios";
import { useRouter } from "vue-router";
import Card from '@/components/Card.vue'
import TitleSeparator from '@/components/TitleSeparator.vue'
import CustomTitleSeparator from '@/components/TitleSeparator.vue'
import Spacing from '@/components/Spacing.vue'
import Modal from "@/components/Modal.vue";

export default {
  name: "Dashboard",
  components: {
    Card,
    TitleSeparator,
    Spacing,
    CustomTitleSeparator,
    Modal
  },
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
      groupButtons: [
        { label: 'Créer', action: this.createGroup },
        { label: 'Rejoindre', action: this.joinGroup },
      ],
      actionsCreate: [
        { label: 'Enregistrer', handler: this.submitGroup }
      ],
      actionsJoin: [
        { label: 'Rejoindre', handler: this.joiningGroup }
      ],
    };
  },
  mounted() {
    this.getGroups();
    this.getLists();
  },
  methods: {

    updateGroupName({ index, value }) {
      this.group_name = value;
    },

    updateInvitationCode({ index, value }) {
      this.invitation_code = value;
    },
    async getGroups() {
      try {
        const response = await axios.get("/user/groups");
        this.groups = response.data.map((group) => ({
          ...group
        }));
        this.displayedGroups = this.groups;
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
      }
    },
  },
};
</script>

<style scoped>
.background {
  margin: 0;
  background-color: white;
  display: flex;
}

.main-container {
  width: 70%;
  margin-bottom: 20px;
}

.center-container {
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.container {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.modal-content input,
.modal-content select {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: white;
}

.modal-content input:focus,
.modal-content select:focus {
    outline: none;
    border-bottom: 3px solid #2C7C45;
    background-color: white;
}

.invitation-code{
  background-color: lightgray;
}


@media (max-width: 1444px) {
  .main-container {
    width: 90%;
  }
}

@media (max-width: 1244px) {
  .container {
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .main-container {
    width: 100%;
    padding: 0 5px;
  }

  .center-container {
    justify-content: flex-end;
    margin: 0 auto;
  }

  .container {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}
</style>
