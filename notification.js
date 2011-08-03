(function() {
  var $popupQueue, $updateCount, notify;
  notify = window.webkitNotifications;
  if (notify == null) {
    return;
  }
  $popupQueue = [];
  $updateCount = 0;
  registerPlugin({
    update: function() {
      return $updateCount++;
    },
    miscTab: function(ele) {
      var div, form, hr, request, state, timeout;
      div = document.createElement('div');
      form = document.createElement('form');
      form.onsubmit = function(e) {
        notify.requestPermission(function() {
          var status, timeout;
          status = document.getElementById('notification_status');
          status.textContent = 'on';
          timeout = document.getElementById('notification_timeout');
          return writeCookie('notification_timeout', timeout.value, 3652);
        });
        return false;
      };
      div.appendChild(form);
      state = document.createElement('span');
      state.id = 'notification_status';
      state.textContent = notify.checkPermission() === 0 ? 'on' : 'off';
      request = document.createElement('input');
      request.type = 'submit';
      request.value = 'Request';
      form.appendChild(document.createTextNode('Notification state: '));
      form.appendChild(state);
      form.appendChild(document.createTextNode(' '));
      form.appendChild(request);
      timeout = document.createElement('input');
      timeout.type = 'text';
      timeout.id = 'notification_timeout';
      timeout.size = 3;
      timeout.value = readCookie('notification_timeout') || 5000;
      form.appendChild(document.createElement('br'));
      form.appendChild(document.createTextNode('Notification timeout: '));
      form.appendChild(timeout);
      form.appendChild(document.createTextNode(' msec'));
      hr = document.createElement('hr');
      hr.className = 'spacer';
      ele.appendChild(div);
      return ele.appendChild(hr);
    },
    gotNewMessage: function(tw) {
      var popup;
      if ($updateCount < 2 || notify.checkPermission() !== 0 || tw.user.screen_name === myname) {
        return;
      }
      popup = notify.createNotification(tw.user.profile_image_url, tw.user.name, tw.text);
      popup.ondisplay = function(e) {
        var timeout;
        timeout = readCookie('notification_timeout') || 5000;
        if (timeout > 0) {
          return setTimeout(function() {
            return e.currentTarget.cancel();
          }, timeout);
        }
      };
      popup.onclose = function(e) {
        $popupQueue.shift();
        if ($popupQueue.length > 0) {
          return $popupQueue[0].show();
        }
      };
      $popupQueue.push(popup);
      if ($popupQueue.length === 1) {
        return popup.show();
      }
    }
  });
}).call(this);