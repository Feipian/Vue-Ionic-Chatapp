<template>
  <ion-page v-if="userId !== undefined">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Appwrite Chat</ion-title>
      </ion-toolbar>
    </ion-header>

<!-- has user -->
  <template v-if="userId">
    <ion-content :fullscreen="true">
      has User
    </ion-content>
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
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonModal } from '@ionic/vue';
import AccountModal from '@/components/AccountModal.vue'
import { appwrite } from '@/appwrite-lib';

const {userId, userInfo} = useUserStore()
const showLogin = ref(false);
const showSignUp = ref(false);

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
    }
  } catch(error){
      alert((error as Error).message);
  }
};

/**
 * handle loggin in user using value from account modal
 */
const handleSignUp = async(data:any) => {
  showSignUp.value = false;
  // Log the received data to the console
  console.log('Received data:', data);

  try {

    console.log('Appwrite URL:', appwrite.account); // Log the URL
    const user = await appwrite.account.create(data?.email, data?.password, data?.displayName);
    // Rest of your code to create a user account
    // const user = await appwrite.account.create(
    //   data?.email,
    //   data?.password,
    //   data?.displayName
    // );
    console.log('User created successfully:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
//   try{
//     const user = await appwrite.account.create(
//       appwrite.ID.unique(),
//       data?.email,
//       data?.password,
//       data?.displayName,
//     );
    
//     userInfo.value = user

//     if (user){
//       const session = await appwrite.account.createEmailSession(
//         data?.email,
//         data?.password
//       );
//       userId.value = session.$id;
//     }
//   } catch(error){
//       alert((error as Error).message);
//   }
// };


</script>

<style scoped>
</style>
