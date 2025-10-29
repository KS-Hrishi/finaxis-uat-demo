document.getElementById("servicesBtn").addEventListener("click", function() {
        document.getElementById("services").scrollIntoView({
         behavior: "smooth",   // smooth scroll animation
          block: "start"        // align to top of the element
           });
         });

         function showsidebar(){
			const sidebar = document.querySelector('.sidebar-custom');
			sidebar.style.display = 'flex';

			const sidebarv = document.querySelector('.custom-nav-div ul');
			sidebarv.style.display = 'flex';

			const sidebaru = document.querySelector('.custom-nav-div');
			sidebaru.style.display = 'flex';
		}

		function hidesidebar(){
           const sidebar = document.querySelector('.sidebar-custom');
			sidebar.style.display = 'none';

			const sidebarv = document.querySelector('.custom-nav-div ul');
			sidebarv.style.display = 'none';

			const sidebaru = document.querySelector('.custom-nav-div');
			sidebaru.style.display = 'none';
		}