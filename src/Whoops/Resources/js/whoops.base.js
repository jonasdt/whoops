Zepto(function($) {

  var $leftPanel      = $('.left-panel');
  var $frameContainer = $('.frames-container');
  var $container      = $('.details-container');
  var $activeLine     = $frameContainer.find('.frame.active');
  var $activeFrame    = $container.find('.frame-code.active');
  var $ajaxEditors    = $('.editor-link[data-ajax]');
  var $header         = $('header');

  $header.on('mouseenter', function () {
    if ($header.find('.exception').height() >= 145) {
      $header.addClass('header-expand');
    }
  });
  $header.on('mouseleave', function () {
    $header.removeClass('header-expand');
  });

  var highlightCurrentLine = function() {
    // Highlight the active and neighboring lines for this frame:
    var activeLineNumber = +($activeLine.find('.frame-line').text());
    var $lines           = $activeFrame.find('.linenums li');
    var firstLine        = +($lines.first().val());

    $($lines[activeLineNumber - firstLine - 1]).addClass('current');
    $($lines[activeLineNumber - firstLine]).addClass('current active');
    $($lines[activeLineNumber - firstLine + 1]).addClass('current');
  }

  // Highlight the active for the first frame:
  highlightCurrentLine();

  $frameContainer.on('click', '.frame', function() {
    var $this  = $(this);
    var id     = /frame\-line\-([\d]*)/.exec($this.attr('id'))[1];
    var $codeFrame = $('#frame-code-' + id);

    if ($codeFrame) {
      $activeLine.removeClass('active');
      $activeFrame.removeClass('active');

      $this.addClass('active');
      $codeFrame.addClass('active');

      $activeLine  = $this;
      $activeFrame = $codeFrame;

      highlightCurrentLine();

      $container.scrollTop(0);
    }
  });

  var clipboard = new Clipboard('.clipboard');
  var showTooltip = function(elem, msg) {
    elem.setAttribute('class', 'clipboard tooltipped tooltipped-s');
    elem.setAttribute('aria-label', msg);
  };

  clipboard.on('success', function(e) {
      e.clearSelection();

      showTooltip(e.trigger, 'Copied!');
  });

  clipboard.on('error', function(e) {
      showTooltip(e.trigger, fallbackMessage(e.action));
  });

  var btn = document.querySelector('.clipboard');

  btn.addEventListener('mouseleave', function(e) {
    e.currentTarget.setAttribute('class', 'clipboard');
    e.currentTarget.removeAttribute('aria-label');
  });

  function fallbackMessage(action) {
    var actionMsg = '';
    var actionKey = (action === 'cut' ? 'X' : 'C');

    if (/Mac/i.test(navigator.userAgent)) {
        actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
    } else {
        actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
    }

    return actionMsg;
  }

  function scrollIntoView($node, $parent) {
    var nodeOffset = $node.offset(),
        nodeTop = nodeOffset.top,
        nodeBottom = nodeTop + nodeOffset.height,
        parentScrollTop = $parent.scrollTop(),
        parentHeight = $parent.height();

    if (nodeTop < 0) {
      $parent.scrollTop(parentScrollTop + nodeTop);
    } else if (nodeBottom > parentHeight) {
      $parent.scrollTop(parentScrollTop + nodeBottom - parentHeight);
    }
  }

  $(document).on('keydown', function(e) {
	  if(e.ctrlKey || e.which === 74  || e.which === 75) {
		  // CTRL+Arrow-UP/k and Arrow-Down/j support:
		  // 1) select the next/prev element
		  // 2) make sure the newly selected element is within the view-scope
		  // 3) focus the (right) container, so arrow-up/down (without ctrl) scroll the details
			  $activeLine.prev('.frame').click();
		  if (e.which === 38 /* arrow up */ || e.which === 75 /* k */) {
			  scrollIntoView($activeLine, $leftPanel);
			  $container.focus();
			  e.preventDefault();
			  $activeLine.next('.frame').click();
		  } else if (e.which === 40 /* arrow down */ || e.which === 74 /* j */) {
        scrollIntoView($activeLine, $leftPanel);
			  $container.focus();
			  e.preventDefault();
		  }
	  }
  });

  // Avoid to quit the page with some protocol (e.g. IntelliJ Platform REST API)
  $ajaxEditors.on('click', function(e){
    e.preventDefault();
    $.get(this.href);
  });

  // Symfony VarDumper: Close the by default expanded objects
  $('.sf-dump-expanded')
    .removeClass('sf-dump-expanded')
    .addClass('sf-dump-compact');
  $('.sf-dump-toggle span').html('&#9654;');
});
