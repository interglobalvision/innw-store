/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Site, Modernizr */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function(){
      _this.onResize();
    });

    if ($('body').hasClass('template-product')) {
      _this.Product.init();
    }

    _this.bindMenuToggle();

    _this.windowWidth = $(window).width();

  },

  onResize: function() {
    var _this = this;

    _this.windowWidth = $(window).width();

    if ($('body').hasClass('template-product')) {
      _this.Product.onResize();
    }
  },

  fixWidows: function() {
    // utility class mainly for use on headines to avoid widows [single words on a new line]
    $('.js-fix-widows').each(function(){
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
    });
  },

  bindMenuToggle: function() {
    var $header = $('#header');

    // toggle side menu on hamburger/X click
    $('.js-menu-toggle').on('click', function() {
      $header.toggleClass('menu-active');
    });

    // hide side menu when click on "page area" of side nav holder
    $('#menu-nav-holder').on('click', function() {
      $header.toggleClass('menu-active');
    });

    // stop clicks on side nav from bubbling up to parent #menu-nav-holder
    $('#menu-nav').on('click', function(e) {
      e.stopPropagation();
    });
  },

};

Site.Product = {
  sliderSpeed: 300,
  init: function() {
    var _this = this;

    if ($('#product-gallery').length) {
      _this.initSlider();
    }

    if ($('#product-select').length) {
      _this.optionSelect();
    }

    _this.bindDetailsToggle();

  },

  initSlider: function() {
    var _this = this;

    $('#product-gallery').slick({
      dots: true,
      arrows: true,
      infinite: true,
      speed: _this.sliderSpeed,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true,
      prevArrow: '.gallery-prev',
      nextArrow: '.gallery-next',
    });
  },

  optionSelect: function() {
    var _this = this;

    _this.selectsStyled = false;

    new Shopify.OptionSelectors("product-select", { product: productJson, onVariantSelected: _this.selectCallback.bind(this) });
    // Callback fires on init and on change to variant select values
  },

  styleVariantSelects: function() {
    var _this = this;

    var $selectorWrapper = $('.selector-wrapper');

    var $dropDownIcon = $('.select-icon-holder');
    var $addToCart = $('#add-to-cart');

    if ($selectorWrapper.length > 1) {
      var $optionWrapper = $selectorWrapper.not($priceWrapper);

      // Add styling classes to variant options that aren't Price
      $optionWrapper.addClass('grid-item item-s-12 grid-row no-gutter align-items-center padding-top-small padding-bottom-small border-bottom');

      // Style Variants options
      var $optionLabel = $optionWrapper.children('label');
      var $optionSelect = $optionWrapper.children('select');

      // Add styling classes to variant Label and Select
      $optionLabel.addClass('grid-item item-s-6 offset-s-2');
      $optionSelect.addClass('full-select item-s-8 offset-s-2');

      // Update Label with select value on change
      $optionSelect.on('change', function() {
        $(this).siblings('label').text($(this).val());
      });

      // Add drop down icon to Option wrapper
      $dropDownIcon.appendTo($optionWrapper);
    } else {
      $dropDownIcon.remove();
    }

    // Style Price and Add to cart
    $('#cart-form').append('<div id="cart-end-row" class="grid-item item-s-12 grid-row no-gutter justify-end"></div>');

    // This is the last row of the form where the Price and Add to cart button will be
    var $endRow = $('#cart-end-row');

    // Put Add to cart button in last row
    $addToCart.appendTo($endRow);

    if ($selectorWrapper.text() !== 'Default Title') {
      var $priceWrapper = $selectorWrapper.last();

      // Put Price option in last row and add styling classes and id
      $priceWrapper.prependTo($endRow).addClass('grid-item item-s-6 no-gutter').attr('id','price-wrapper');

      // Remove Price option label. We don't need it
      $priceWrapper.children('label').remove();

      // Add wrapper divs for the rotary display component
      $priceWrapper.append('<div id="price-display-wrapper"><div id="price-display"></div></div>');

      _this.$priceDisplayWrapper = $('#price-display-wrapper');
      _this.$priceDisplay = $('#price-display');

      var $priceSelect = $priceWrapper.children('select')

      // Hide the select element and stretch it across it's wrapper
      $priceSelect.addClass('full-select');

      // Get Price options from select
      var $priceOptions = $priceWrapper.find('option');

      // Add Price option values as display values to rotary display component
      $priceOptions.map(function() {
        var value = $(this).text();
        _this.$priceDisplay.append('<div class="price-label" data-value="' + value + '">' + value + '</div>');
      });

      _this.$priceLabel = $('.price-label');

      // Get the middle price and set it as initial
      _this.priceIndex = Math.floor($priceOptions.length / 2);
      _this.positionSelectedPrice();
      $priceSelect.val($(_this.$priceLabel[_this.priceIndex]).attr('data-value'));

      // Update display price on select change
      $priceSelect.on('change', function() {
        var value = $(this).val();
        var $price = _this.$priceLabel.filter('[data-value="' + value + '"]');

        _this.priceIndex = _this.$priceLabel.index($price);
        _this.positionSelectedPrice();
      });
    } else {
      $selectorWrapper.remove()
    }

    // Prevent styling again
    _this.selectsStyled = true;
  },

  positionSelectedPrice: function() {
    var _this = this;

    // Update the height of price display
    _this.priceHeight = _this.$priceLabel.height();
    _this.$priceDisplayWrapper.css('height', _this.priceHeight + 'px');

    // Rotate display price to selected price
    var displayOffset = _this.priceIndex * _this.priceHeight;
    _this.$priceDisplay.css('transform', 'translateY(-' + displayOffset + 'px)');
  },

  selectCallback: function(variant, selector) {
    var _this = this;

    if (variant) {
      if (!_this.selectsStyled) {
        _this.styleVariantSelects();
      }

      if (variant.available) {
        // Selected a valid variant that is available.
        $('#add').removeClass('disabled').removeAttr('disabled').val('Add to Cart');
      } else {
        // Variant is sold out.
        $('#add').val('Sold Out').addClass('disabled').attr('disabled', 'disabled');
      }
    } else {
      // variant doesn't exist.
      $('#add').val('Unavailable').addClass('disabled').attr('disabled', 'disabled');
    }

  },

  bindDetailsToggle: function() {
    $('#product-details-header').on('click', function() {
      if (Site.windowWidth < 1024) {
        $('#product').toggleClass('details-active');
      }
    });
  },

  onResize: function() {
    var _this = this;

    if ($('#product-gallery').length) {
      //_this.setGalleryWidth();
    }

    _this.positionSelectedPrice();
  },

}

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});
