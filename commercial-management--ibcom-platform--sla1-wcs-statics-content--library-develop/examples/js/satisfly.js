/**
 * script de login a redes sociales.
 * autenticacion del usuario,auth_provider= 'facebook' o 'linkedin'    
 */
	
	function cas_join_login(auth_provider, socialLoginUrl, redirTo, contextRoot, principalUserId){
		return (contextRoot + "/socialLoginInit.do?socialLoginUrl=" + socialLoginUrl + "&redirTo=" + redirTo +"&providerCas="+auth_provider);
		/*
		  var urlUpdate = contextRoot + '/providerCasUpdate.do?redirTo=' + redirTo +"&providerCas="+auth_provider;
		  var urlPopup = "";
			$.ajax({
			   type: "POST",
			   url: urlUpdate,
			   data: '',
				   dataType: "html",
				   async: false, 
				   success:function(data){
						var protected_url = location.protocol + '//' + location.host + contextRoot;				 
						protected_url = protected_url + '/returnSatisfly.do';
						if(principalUserId=='0'){
							urlPopup = socialLoginUrl + auth_provider +'?protected_url=' + protected_url;

						}else{		
							socialLoginUrl = socialLoginUrl.replace("iberiajava", "iberiajoin");
							socialLoginUrl = socialLoginUrl.replace("set_provider/","set_principal_user/user_");	
							urlPopup = socialLoginUrl + auth_provider +'/'+principalUserId +'?protected_url=' + protected_url;
						}
						
				   }
			});
			
			return urlPopup;
		*/
	}


	function cas_login(auth_provider, socialLoginUrl, redirTo, contextRoot){
		return (contextRoot + "/socialLoginInit.do?socialLoginUrl=" + socialLoginUrl + "&redirTo=" + redirTo +"&providerCas="+auth_provider);
		/*
		  var urlUpdate = contextRoot + '/providerCasUpdate.do?redirTo=' + redirTo +"&providerCas="+auth_provider;
		  var urlPopup = "";
			$.ajax({
			   type: "POST",
			   url: urlUpdate,
			   data: '',
				   dataType: "html",
				   async: false, 
				   success:function(data){
						var protected_url = location.protocol + '//' + location.host + contextRoot;				 
						protected_url = protected_url + '/returnSatisfly.do';
						urlPopup = socialLoginUrl + auth_provider +'?protected_url=' + protected_url;				
				   }
			});
			
			return urlPopup;
		*/
	}
	

	function cas_logout(socialLogoutUrl, protectedUrl){
    	//window.location.replace (socialLogoutUrl +'?callback_url=' + protectedUrl);
		window.location.replace (protectedUrl);
	}
	
  function desvincularRedSocial(redSocial, contextRoot){
		var protected_url = contextRoot + '/saveDisconnectRRSS.do?provider_for_cas='+redSocial;
		window.location.replace(protected_url);
	}