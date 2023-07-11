$(document).ready(function () {
  // API Endpoint to
  var courseUnlockDomain = "<CUSTOM_API_ENDPOINT>";
  var courseID = Number(ENV.COURSE_ID);
  var domain = window.location.hostname;
  //check if date is in past
  function isPastDate(inputDate) {
    if (inputDate === null) {
      return true;
    }
    var currentDate = new Date();
    var targetDate = new Date(inputDate);
    return currentDate > targetDate;
  }

  function getCookie(name) {
    return document.cookie.split(";").reduce(function (a, c) {
      const d = c.trim().split("=", 2);
      return d[0] === name ? decodeURIComponent(d[1]) : a;
    }, "");
  }

  /*
	Start Course Unlock/Lock
	*/
  if (onPage(/\/courses\/\d+\/settings/)) {
    const spinner =
      '<div id="status_box" style="text-align: center;"> <img alt="Loading" src="https://du11hjcvx0uqb.cloudfront.net/br/dist/images/ajax-loader-small-5ae081ad76.gif"></div>';
    //validation variables
    var isYACAcct = true;
    var isTermConcluded = false;
    var isCourseConcluded = false;
    //current date + 1 week
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    var unlockData = {
      restrict_enrollments_to_course_dates: true,
      end_at: futureDate.toISOString(),
      courseId: courseID,
    };
    var lockData = {
      restrict_enrollments_to_course_dates: false,
      end_at: "null",
      courseId: courseID,
    };
    lockData.authenticity_token = getCookie("_csrf_token");
    unlockData.authenticity_token = getCookie("_csrf_token");
    //API URLs
    var listCoursesInAcctURL =
      "https://" +
      domain +
      ":443/api/v1/accounts/sis_account_id:YAC/courses?search_term=" +
      courseID;
    var getSingleCourseURL =
      "https://" +
      domain +
      ":443/api/v1/courses/" +
      courseID +
      "?include[]=term";
    //API Calls
    var fetchCoursesInAcct = $.getJSON(listCoursesInAcctURL, function (data) {
      if (data.length > 0) {
        isYACAcct = true;
      }
    });
    var fetchSingleCourse = $.getJSON(getSingleCourseURL, function (data) {
      isTermConcluded = isPastDate(data.term.end_at);
      isCourseConcluded = isPastDate(data.end_at);
    });

    function handleUnlockClick() {
      $("#course-unlockbutton").replaceWith(spinner);
      fetch(courseUnlockDomain, {
        method: "PUT", // or 'PUT'
        body: JSON.stringify(unlockData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => location.reload())
        .catch((error) => console.error("Error:", error));
    }

    function handleLockClick() {
      $("#course-lockbutton").replaceWith(spinner);
      fetch(courseUnlockDomain, {
        method: "PUT", // or 'PUT'
        body: JSON.stringify(lockData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => location.reload())
        .catch((error) => console.error("Error:", error));
    }

    //check if course is in YAC account
    fetchCoursesInAcct.always(function () {
      if (isYACAcct) {
        fetchSingleCourse.always(function () {
          if (isTermConcluded) {
            if (isCourseConcluded) {
              $(
                '<a id="course-unlockbutton" class="Button Button--link Button--link--has-divider Button--course-settings validator_link"> <i class="icon-unlock"></i>Unlock Course</a>'
              ).insertBefore("#right-side .summary");
              document
                .getElementById("course-unlockbutton")
                .addEventListener("click", handleUnlockClick, false);
            } else {
              $(
                '<a id="course-lockbutton" class="Button Button--link Button--link--has-divider Button--course-settings validator_link"> <i class="icon-lock"></i>Lock Course</a>'
              ).insertBefore("#right-side .summary");
              document
                .getElementById("course-lockbutton")
                .addEventListener("click", handleLockClick, false);
            }
          }
        });
      }
    });
  }
  /*
	End Course Unlock/Lock
	*/
});
