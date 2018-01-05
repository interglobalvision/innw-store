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

  },

  onResize: function() {
    var _this = this;

    if ($('#product-gallery').length) {
      _this.Product.setGalleryWidth();
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

  },

  initSlider: function() {
    var _this = this;

    $('#product-gallery').slick({
      dots: true,
      arrows: true,
      infinite: true,
      speed: _this.sliderSpeed,
      slidesToShow: 1,
    });
  },

  optionSelect: function() {
    var _this = this;

    new Shopify.OptionSelectors("product-select", { product: productJson, onVariantSelected: _this.selectCallback });
  },

  selectCallback: function(variant, selector) {
    if (variant) {
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
  }

}

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});
