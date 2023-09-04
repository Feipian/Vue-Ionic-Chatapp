<template>
  <ion-page v-if="userId !== undefined">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Appwrite Chat</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="doLogout">LOGOUT</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

<!-- has user -->
  <template v-if="userId">
    <ion-content :fullscreen="true" ref="contentRef">
      <h1> Hello: {{userInfo?.name || userInfo?.email }} </h1>
      <div>
        <div v-for="chat in messages" :key="chat.$id" class="chat-bubble">
          <div class="message">
            <span v-if="chat.owner === userId" style="font-weight: bold">ME</span>
            <span v-else style="font-weight: bold"> {{ chat?.displayName }}</span>
            {{ chat?.message }}
            <div class="chat-date"> {{ chat?.$updatedAt }}</div>
          </div>
          
        </div>
      </div>
    </ion-content>

    <ion-footer>
      <ion-item>
        <ion-input type="text" v-model="messageText"> </ion-input>
        <ion-button :disabled="!messageText" @click="sendMessage">SEND</ion-button>
      </ion-item>
    </ion-footer>
  </template>

  <!-- no user -->
  <template v-else-if="!userId">
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-button 
        expand="block"
        style="margin-bottom: 16px"
        @click= "showLogin = true">
        Login
      </ion-button>

      <ion-button 
        expand="block"
        style="margin-bottom: 16px"
        @click= "showSignUp = true">
        SIGN UP
      </ion-button>
      
      <ion-modal :is-open="showLogin">
        <account-modal 
          mode="LOGIN"
          @on-dismiss="showLogin = false"
          @on-action = "handleLogin">
        </account-modal>
      </ion-modal>

      <ion-modal :is-open="showSignUp">
        <account-modal 
          mode="SIGNUP"
          @on-dismiss="showSignUp = false"
          @on-action = "handleSignUp">
        </account-modal>
      </ion-modal>
    </ion-content>
  </template>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/userStore';
import { IonContent, IonItem, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonModal, IonInput, IonButtons, IonFooter, onIonViewWillEnter } from '@ionic/vue';
import AccountModal from '@/components/AccountModal.vue'
import { appwrite } from '@/appwrite-lib';
import { Query } from 'appwrite';

const {userId, userInfo, messages} = useUserStore()
const showLogin = ref(false);
const showSignUp = ref(false);
const messageText = ref("");
const contentRef = ref();

onIonViewWillEnter(()=>{
  // load exists data
  loadData();

  // add new data
  appwrite.client.subscribe(
    `databases.${import.meta.env.VITE_APPWRITE_DB}.collections.${import.meta.env.VITE_APPWRITE_COLLECTION}.documents`,
    ({payload}) => {
      let prev = messages.value;
      messages.value = [...prev, payload]

      setTimeout(()=>{
        contentRef.value.$el.scrollToBottom(500);
      }, 1000);

    }
  )
});

/**
 * load data from database
 */

const loadData = async() => {
if (!userId.value) return;
  
try{
  const {documents} = await appwrite.Databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DB,
    import.meta.env.VITE_APPWRITE_COLLECTION,
    [Query.orderAsc('$updatedAt')]
  );
  messages.value = documents;

  setTimeout(()=>{
        contentRef.value.$el.scrollToBottom(500);
      }, 1000);
}
catch(error){
  alert((error as Error).message);
  messages.value = [];
}
};



/**
 * 
 */
const doLogout = async () =>{
  await appwrite.account.deleteSessions();
  userId.value = null;
  messages.value = null;
  userInfo.value = null;
}

/**
 * 
 */
const sendMessage = async() => {
  if (!messageText.value || !userId.value) return;
  try{
    await appwrite.Databases.createDocument(
      import.meta.env.VITE_APPWRITE_DB,
      import.meta.env.VITE_APPWRITE_COLLECTION,
      appwrite.ID.unique(),
      {
        message: messageText.value,
        owner: userId.value,
        displayName : userInfo.value.name
      }
    );
    messageText.value = "";
    contentRef.value.$el.scrollToBottom(500);
  }catch(error){
    alert((error as Error).message);
  }
};
/**
 * handle loggin in user using value from account modal
 */
 const handleLogin = async(data:any) => {
  showLogin.value = false;
  try{
    const session = await appwrite.account.createEmailSession(
      data?.email,
      data?.password,
    );
    if (session){
      userId.value = session.$id;
      const user = await appwrite.account.get();
      userInfo.value = user;

      // load data (chat)
      loadData();
    }
  } catch(error){
      alert((error as Error).message);
  }
};

/**
 * handle loggin in user using value from account modal
 */

const handleSignUp = async(data:any) => {
// Handle the sign-up logic here
console.log('Sign-up data:', data?.email);

// Close the sign-up modal (if needed)
showSignUp.value = false;

try{
    const user = await appwrite.account.create(
      appwrite.ID.unique(),
      data?.email,
      data?.password,
      data?.displayName,
    );
    
    userInfo.value = user

    if (user){
      const session = await appwrite.account.createEmailSession(
        data?.email,
        data?.password
      );
      userId.value = session.$id;

      // load data (chat)
      loadData();
    }
  } catch(error){
      alert((error as Error).message);
  }
};


</script>

<style scoped>
  .chat-bubble{
    display: flex;
    align-items: center;
    padding: 8px;
    margin-bottom: 10px;
  }

  .message {
    background-color: #e4e4e4;
    padding: 10px;
    border-radius: 16px;
    margin-right: 10px;
  }

  .chat-date {
    font-size: smaller;
    margin-top: 8px;
  }
</style>
