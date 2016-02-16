/**
 * @file jquery.ringmenu.js
 * Creates a ring menu out of a set of elements
 * 
 * Because of the way jQuery's click() function works, all link actions will need to be set using jQuery's event handlers.
 * The HREF attribute of any links will be ignored
 */

(function($) {
  $.fn.ringmenu = function(options) {
    
    // Default options
    var defaults = {
      radian_offset: Math.PI / 2.0, // Amount to shift all of the items from their default position in the ring.  Useful for positioning the first element of the list at the of the ring (90 degrees) rather than the far right (0 degrees) 
      item_type: 'li',  // Selector string for the items in the list
      radius: 100,      // Radius of the ring in pixels
      duration: 350,    // Duration of the expand / close animation in milliseconds
      use_anchor_hrefs: true,  // If true, we'll generate click events for each list item which redirect to the href specified in the first anchor contained within the list item
      show_selected_when_closed: true // If true, show the selected menu item when the menu is closed.  This will also show the first tem on load.  If false, the selected item is hidden on close, and the first item is hidden on load.
    }
    
    // Process each element 
    return this.each(function() {
      // Check to see if this is for initialization or an operation on an existing menu
      if (typeof options == "string") {
        switch(options) {
          case 'open':
            // Open the menu if it's not already
            if (!this.is_expanded) {
              animate_ring_menu(this, {x: $(this).width() / 2, y: $(this).height() / 2 });
            }
            break;
          case 'close':
            // Close the menu if it's not already
            if (this.is_expanded) {
              animate_ring_menu(this, {x: $(this).width() / 2, y: $(this).height() / 2 });
            }
            break;
          case 'toggle':
            // Animate the menu
            animate_ring_menu(this, {x: $(this).width() / 2, y: $(this).height() / 2 });
            break;
          default:
            console.log("Unknown ringmenu command: " + options);
            break;
        };
        return;
      }
      
      // Standard Initialization process
      this.options = $.extend(defaults, options);
      
      var that = this;  // Helper variable for referring to this object within other events
      var items = $(that.options.item_type, this);  // All of the items in this container
      var first_item = $(items).filter(':first'); // The first item in the list
      this.is_tracking = false; // True if the element is currently tracking the mouse position
      this.is_expanded = false; // True if the menu is currently expanded

      // Add classes to the container and items
      $(this).addClass('ringmenu');
      $(items).addClass('ringmenu-item');
      
      // Add custom CSS to the container and items
      $(this).css({
        width: this.options.radius * 2,
        height: this.options.radius * 2,
      });
      
      /**
       * Calculate the minimum width of an item.  This needs to be set to prevent the right-most ring items
       * from collapsing into multiple lines when reaching the right-most edge of the container
       */
      var min_width = $(this).width();
      $(items).each(function() {
        if ($(this).width() < min_width) {
          min_width = $(this).width();
        }
      });
      
      // Move the items to the center of the container 
      $(items).css({
        marginLeft: $(that).width() / 2 - first_item.width() / 2,
        marginTop: $(that).height() / 2 - first_item.height() / 2,
        width: min_width
      })
      
      // Hide each item.  If the correct option is set, keep the first item visible
      $(items).hide();
      if (this.options.show_selected_when_closed) {
        $(first_item).show();
      }
      
      // Fix the item-list to redirect to the URL specified by the first child anchor when clicked on
      if (this.options.use_anchor_hrefs) {
        set_anchors_as_events(this, this.options.item_type);
      }
      
      /**
       * Process clicks on the menu
       */
      $(this).click(function(evnt) {
        if (!evnt.pageX || !evnt.pageY) {
          return;
        }
          
        if (that.is_expanded) {
          var click_position = {
            x: evnt.pageX,
            y: evnt.pageY
          };
          
          // Figure out what section we're in
          var num_items = $(that.options.item_type, that).length;
          var section = calculate_ring_section(click_position, that, num_items, that.options.radian_offset);
          var section_element = $(that.options.item_type, that).get(section);
          $(section_element).addClass('ringmenu-selected');
          $(section_element).click();
        }
        
        // Animate the menu
        animate_ring_menu(this, {x: $(that).width() / 2, y: $(that).height() / 2 });
      });
            
      /**
       * Start tracking the mouse when it enters the container region
       */
      $(this).mouseenter(function(evnt) {
        that.is_tracking = true;
      });
  
      /**
       * Stop tracking the mouse when it enters the container region
       */
      $(this).mouseleave(function(evnt) {
        that.is_tracking = false;
      });
  
      /**
       * Process the mouse position to see which section it's in
       */
      $(this).mousemove(function(evnt) {
        if (!that.is_tracking || !that.is_expanded) {
          $(that.options.item_type, that).removeClass('hovered');
          return;
        }
    
        var click_position = {
          x: evnt.pageX,
          y: evnt.pageY
        };
        
        var num_items = $(that.options.item_type, that).length;
        var section = calculate_ring_section(click_position, that, num_items, that.options.radian_offset);
        
        var elem_count = 0;
        $(that.options.item_type, that).each(function() {
          if (elem_count == section) {
            $(this).addClass('hovered');
          }
          else {
            $(this).removeClass('hovered');
          }
          elem_count++;
        });
      });
    });
    
    /********************
     * Helper functions
     ********************/
    
    /**
     * Generates window.location redirections on-click for any list items containing an anchor as a child.
     * The first anchor child is used
     * 
     * @param object containter The DOM element that contains the menu items
     * @param string item_type Selector string for each of the list items 
     */
    function set_anchors_as_events(container, item_type) {
      $(item_type, container).each(function(index, element) {
        var link = $('a:first', $(this));
        var url = $(link).attr('href');
        
        if (url) {
          $(this).click(function(evnt) {
            window.location = url;
          });
        }
      });
    }
   
    /**
     * Calculates which section a given position is in relative to a given element
     * 
     * @param Object global_position The position to check, relative to the document.  Expected elements are x and y
     * @param Object parent_element The element that contains the sections
     * @param int num_sections The number of sections
     * @param float radian_offset An optional number of radians to offset the angle by
     * 
     * @return int the section number (starting at 0)
     */
    function calculate_ring_section(global_position, parent_element, num_sections, radian_offset) {
      var radians_per_section = 2 * Math.PI / num_sections; // Number of radians per section
      var parent_position = $(parent_element).position(); // Position of the parent element
      
      var relative_position = { // Global position relative to the center of parent_element
        x: global_position.x - (parent_position.left + $(parent_element).width() / 2.0),
        y: -(global_position.y - (parent_position.top + $(parent_element).height() / 2.0)) // Take the negative to convert coord system to one where +y is up
      };
      
      // Normalize the relative position
      // Calculate the magnitude, using 1.0 for the rare instance where the global_position is directly over the center of the parent_element
      var magnitude = Math.sqrt(relative_position.x * relative_position.x + relative_position.y * relative_position.y);
      if (magnitude == 0.0) {
        magnitude = 1.0;
      }
      relative_position.x /= magnitude;
      relative_position.y /= magnitude;
      
      /**
       * Calculate the angle relative to 0 radians, then adjust for the given offset and shift the angle so that the section area
       * is split equally between both sides of the actual item location
       */  
      var angle = Math.atan2(relative_position.y, relative_position.x) - Math.atan2(0.0, 1.0);
      angle -= radian_offset - radians_per_section / 2.0;
      
      // Convert the range of radians from (-PI => PI) to (0 => 2PI)
      if (angle < 0.0) {
        angle = 2 * Math.PI + angle;  
      }
      
      var section = Math.floor(angle / radians_per_section);
      return section;
    }

    /**
     * Animates the ring menu itself
     * 
     * @param object containter The DOM element that contains the menu items
     * @param object position The center of the ring relative to the container
     */
    function animate_ring_menu(container, position) {
      container.is_expanded ^= true; // Toggle the state of the menu
      
      if (container.is_expanded) { // Expand the ring menu
        var count = 0;  // Loop counter
        var num_items = $(container.options.item_type, container).length;  // The number of items in the list
        var rads_per_item = 2 * Math.PI / num_items;  // The number of radians given to each item
              
        $(container.options.item_type, container).each(function() {
          // Clear any existing selected element
          if ($(this).hasClass('ringmenu-selected')) {
            $(this).removeClass('ringmenu-selected');
          }
        
          $(this).show(); // Make the item visible
          
          // Figure out how far the item needs to travel outwards
          var angle = container.options.radian_offset + (rads_per_item * count);
          var delta = {
            x: position.x - $(this).width() / 2 + container.options.radius * Math.cos(angle),
            y: position.y - $(this).height() / 2 +  container.options.radius * -Math.sin(angle)
          }
          
          // Animate the item
          $(this).stop().animate({
              marginLeft: delta.x,
              marginTop: delta.y,
              opacity: 1
            }, {
              duration: container.options.duration,
              queue: false,
            }
          );
      
          count++;
        });
        
        $(container.options.item_type, container).show();
      }
      else {  // Contract the ring menu
        var selected = $('.ringmenu-selected', container);
        $(container.options.item_type, container).stop().animate({
            marginLeft: position.x - $(selected).width() / 2,
            marginTop: position.y - $(selected).height() / 2,
            opacity: 0
          }, {
            duration: container.options.duration,
            queue: false,
            complete: function() {              
              if ($(this).hasClass('ringmenu-selected')) {
                $(this).removeClass('ringmenu-selected');
                if (container.options.show_selected_when_closed) {
                  $(this).css('opacity', 1.0);
                }
              }
              else {
                $(this).hide();
              }              
            }
          }
        );
      }
    }
  }
})(jQuery);

