$(document).ready(function () {
  //***Begin People Tool Configuration
  // always use IIFE, to isolate code from global scope
  (function () {
    "use strict";
    // only run this code on the users page
    if (/^\/courses\/\d+\/users$/.test(window.location.pathname)) {
      $("#role_id option[value=3]").remove();
      $("#role_id option[value=10]").remove();
      $("#role_id option[value=11]").remove();
      $("#role_id option[value=4]").remove();
      $("#role_id option[value=9]").remove();
      $("#role_id option[value=7]").remove();
      if (!ENV.permissions.manage_students) {
        $("#role_id option[value=12]").remove();
        $("#role_id option[value=5]").remove();
        $("#role_id option[value=26]").remove();
        $("#role_id option[value=32]").remove();
        $("#role_id option[value=35]").remove();
        $("#role_id option[value=6]").remove();
      }

      const addPeopleModal = function (mtx, obs) {
        let watchResults = document.querySelector(
          'span > span > span > span > div[role="presentation"] > ul[role="listbox"]'
        );
        // the result list is available
        if (watchResults) {
          //Remove roles from "Add People" screen within a course
          //student
          $("#3").remove();
          //shopper
          $("#10").remove();
          //auditor
          $("#11").remove();
          //teacher
          $("#4").remove();
          //instructor
          $("#9").remove();
          //observer
          $("#7").remove();
          if (!ENV.permissions.manage_students) {
            //guest instructor
            $("#12").remove();
            //ta
            $("#5").remove();
            //grader
            $("#26").remove();
            //ula
            $("#32").remove();
            //accessibility support
            $("#35").remove();
            //designer
            $("#6").remove();
          }
        }
      };

      // wait for the modal to be open
      const watchForModal = function () {
        const uiDialog = function (mtx, obs) {
          let pplMdl = document.getElementById("add_people_modal");
          // the modal is found
          if (pplMdl) {
            const defaultRole = document.getElementById(
              "peoplesearch_select_role"
            );
            if (
              defaultRole.value === "Student" ||
              defaultRole.value === "Teacher"
            ) {
              defaultRole.value = "";
            }
            if (
              $("#add_people_modal").length == 1 &&
              $("#addPeople-yaleDirLink").length == 0
            ) {
              //Change "Login Id" to "NetID" on "Add People" screen within a course
              $('[for="peoplesearch_radio_unique_id"] span:nth-child(2)').text(
                "NetID or LoginID"
              );

              //Hide "SIS ID" on "Add People" screen within a course
              $('[for="peoplesearch_radio_sis_user_id"]').hide();
              //Add Yale Directory Link on "Add People" screen within a course
              $(
                ".addpeople__peoplesearch fieldset:nth-child(2) div:first"
              ).append(
                "<div id='addPeople-yaleDirLink' style='float: right;'><a href='https://directory.yale.edu' target='_blank'>Yale Directory</a></div>"
              );
              $("#peoplesearch_select_role").css({
                border: "2px solid red",
                "border-radius": "4px",
              });
              var roleWarning =
                "<h6 id='addPeople-yaleRoleWarning'>Please select a role to continue</h6>";
              $(
                '[for="peoplesearch_select_role"] span:first span:first'
              ).append(roleWarning);
            }
            if (
              $("#peoplesearch_select_role").val() === "" ||
              $(
                ".addpeople__peoplesearch fieldset:nth-child(2) textarea"
              ).val() === ""
            ) {
              $("#addpeople_next").hide();
            } else {
              $("#addpeople_next").show();
            }

            //hide/show next button based on role select

            if (
              $("#peoplesearch_select_role").val() === "" ||
              $(
                ".addpeople__peoplesearch fieldset:nth-child(2) textarea"
              ).val() === ""
            ) {
              $("#addpeople_next").hide();
            } else {
              $("#addpeople_next").show();
            }
            if ($("#peoplesearch_select_role").val() === "") {
              $("#peoplesearch_select_role").css({
                border: "2px solid red",
                "border-radius": "4px",
              });
              $("#addPeople-yaleRoleWarning").show();
            } else {
              $("#peoplesearch_select_role").css({
                border: "",
                "border-radius": "",
              });
              $("#addPeople-yaleRoleWarning").hide();
            }
            // watch the add people modal instead
            const observer = new MutationObserver(addPeopleModal);
            observer.observe(document.body, {
              childList: true,
              subtree: true,
            });
          }
        };

        // watch document.body for modal
        const observer = new MutationObserver(uiDialog);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      };

      // start when the user clicks the compose button
      watchForModal();
    }
  })();
  //***End People Tool Configuration
});
