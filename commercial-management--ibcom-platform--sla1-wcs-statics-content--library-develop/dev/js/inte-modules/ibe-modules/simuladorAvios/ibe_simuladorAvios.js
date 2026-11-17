import { isLogado } from '../manage/ibe_logged-service';

const userZero = document.getElementById("IBZERORegister");
const userUpgrade = document.getElementById("UPGRADEIBplus");

$(document).ready(() => {
  const isLogged = isLogado();
  if(userZero != null || userUpgrade != null){
    if(isLogged.userLogged){ 
      if(isLogged.userType === "IBPLUS"){
        userZero.classList.add("hidden");
        userUpgrade.classList.add("hidden");
  
      } else if (isLogged.userType === "IBZERO"){
        userZero.classList.add("hidden");
        userUpgrade.classList.remove("hidden");
  
        // Metricas User IBZERO
        document.querySelector('.ibe-avios-simulator-banner__background').addEventListener('click', function() {
          const eventBannerZero = {
            eventName: 'interaccion',
            eventCategory: 'simulador avios',
            eventAction: 'registro ib+',
            eventLabel: ' botón visible usuario iberia zero',
          };
          if (typeof (window.DigitalChange) !== 'undefined') {
            window.DigitalChange('interaction', eventBannerZero);
          }
          if (typeof (window.dataLayer) !== 'undefined') {
            window.dataLayer.push(eventBannerZero, { event: 'interaction' });
          }
        });
        
      } else {
        userZero.classList.remove("hidden");
        userUpgrade.classList.add("hidden");
        // Metrica User Anon
        document.querySelector('.ibe-avios-simulator-banner__background').addEventListener('click', function() {
          const eventBannerAnon = {
            eventName: 'interaccion',
            eventCategory: 'simulador avios',
            eventAction: 'registro ib+',
            eventLabel: 'botón visible usuario anónimo',
          };
          if (typeof (window.DigitalChange) !== 'undefined') {
            window.DigitalChange('interaction', eventBannerAnon);
          }
          if (typeof (window.dataLayer) !== 'undefined') {
            window.dataLayer.push(eventBannerAnon, { event: 'interaction' });
          }
        });
      }
    }
  }
});
