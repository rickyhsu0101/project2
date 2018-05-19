import { headerInit } from '../general/header.js';

import '../../css/style.css';
import '../../css/profile.css';

$(document).ready(function() {
  headerInit();
  $('.modal').modal();
  $("#changeAvatar").on("click", function(){
    $('.modal').modal('open');
  });
});
