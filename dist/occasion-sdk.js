/*
	Occasion Javascript SDK 0.1.0
	(c) 2017 Peak Labs, LLC DBA Occasion App
	Occasion Javascript SDK may be freely distributed under the MIT license
*/

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["active-resource"], function (a0) {
      return (root['Occasion'] = factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("active-resource"));
  } else {
    root['Occasion'] = factory(root["active-resource"]);
  }
}(this, function (ActiveResource) {

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Occasion = function () {
  function Occasion() {
    _classCallCheck(this, Occasion);
  }

  _createClass(Occasion, null, [{
    key: 'Client',
    value: function Client(token) {
      var encodedToken = window.btoa(unescape(encodeURIComponent(token + ':')));

      var resourceLibrary = ActiveResource.createResourceLibrary(Occasion.baseUrl, {
        headers: {
          Authorization: "Basic " + encodedToken,
          'User-Agent': 'OccasionSDK'
        }
      });

      Occasion.Modules.each(function (initializeModule) {
        initializeModule(resourceLibrary);
      });

      return resourceLibrary;
    }
  }]);

  return Occasion;
}();

Occasion.baseUrl = 'https://app.getoccasion.com/api/v1';

Occasion.Modules = ActiveResource.prototype.Collection.build();
Occasion.Modules.push(function (library) {
  library.Answer = function (_library$Base) {
    _inherits(Answer, _library$Base);

    function Answer() {
      _classCallCheck(this, Answer);

      return _possibleConstructorReturn(this, (Answer.__proto__ || Object.getPrototypeOf(Answer)).apply(this, arguments));
    }

    return Answer;
  }(library.Base);

  library.Answer.className = 'Answer';
  library.Answer.queryName = 'answers';

  library.Answer.belongsTo('question');
  library.Answer.belongsTo('option');
  library.Answer.belongsTo('order');
});
Occasion.Modules.push(function (library) {
  library.Coupon = function (_library$Base2) {
    _inherits(Coupon, _library$Base2);

    function Coupon() {
      _classCallCheck(this, Coupon);

      return _possibleConstructorReturn(this, (Coupon.__proto__ || Object.getPrototypeOf(Coupon)).apply(this, arguments));
    }

    return Coupon;
  }(library.Base);

  library.Coupon.className = 'Coupon';
  library.Coupon.queryName = 'coupons';

  library.Coupon.belongsTo('merchant');
  library.Coupon.hasMany('orders');
});
Occasion.Modules.push(function (library) {
  library.Currency = function (_library$Base3) {
    _inherits(Currency, _library$Base3);

    function Currency() {
      _classCallCheck(this, Currency);

      return _possibleConstructorReturn(this, (Currency.__proto__ || Object.getPrototypeOf(Currency)).apply(this, arguments));
    }

    return Currency;
  }(library.Base);

  library.Currency.className = 'Currency';
  library.Currency.queryName = 'currencies';

  library.Currency.hasMany('merchants');
  library.Currency.hasMany('orders');
});
Occasion.Modules.push(function (library) {
  library.Customer = function (_library$Base4) {
    _inherits(Customer, _library$Base4);

    function Customer() {
      _classCallCheck(this, Customer);

      return _possibleConstructorReturn(this, (Customer.__proto__ || Object.getPrototypeOf(Customer)).apply(this, arguments));
    }

    return Customer;
  }(library.Base);

  library.Customer.className = 'Customer';
  library.Customer.queryName = 'customers';
});
Occasion.Modules.push(function (library) {
  library.Merchant = function (_library$Base5) {
    _inherits(Merchant, _library$Base5);

    function Merchant() {
      _classCallCheck(this, Merchant);

      return _possibleConstructorReturn(this, (Merchant.__proto__ || Object.getPrototypeOf(Merchant)).apply(this, arguments));
    }

    return Merchant;
  }(library.Base);

  library.Merchant.className = 'Merchant';
  library.Merchant.queryName = 'merchants';

  library.Merchant.belongsTo('currency');
  library.Merchant.hasMany('products');
  library.Merchant.hasMany('venues');
});
Occasion.Modules.push(function (library) {
  library.Option = function (_library$Base6) {
    _inherits(Option, _library$Base6);

    function Option() {
      _classCallCheck(this, Option);

      return _possibleConstructorReturn(this, (Option.__proto__ || Object.getPrototypeOf(Option)).apply(this, arguments));
    }

    return Option;
  }(library.Base);

  library.Option.className = 'Option';
  library.Option.queryName = 'options';

  library.Option.belongsTo('answer');
  library.Option.belongsTo('question');
});
Occasion.Modules.push(function (library) {
  library.Order = function (_library$Base7) {
    _inherits(Order, _library$Base7);

    function Order() {
      _classCallCheck(this, Order);

      return _possibleConstructorReturn(this, (Order.__proto__ || Object.getPrototypeOf(Order)).apply(this, arguments));
    }

    return Order;
  }(library.Base);

  library.Order.className = 'Order';
  library.Order.queryName = 'orders';

  library.Order.belongsTo('coupon');
  library.Order.belongsTo('currency');
  library.Order.belongsTo('customer', { autosave: true });
  library.Order.belongsTo('merchant');
  library.Order.belongsTo('product');

  library.Order.hasMany('answers', { autosave: true });
  library.Order.hasMany('timeSlots');
  library.Order.hasMany('transactions', { autosave: true });
});
Occasion.Modules.push(function (library) {
  library.PaymentMethod = function (_library$Base8) {
    _inherits(PaymentMethod, _library$Base8);

    function PaymentMethod() {
      _classCallCheck(this, PaymentMethod);

      return _possibleConstructorReturn(this, (PaymentMethod.__proto__ || Object.getPrototypeOf(PaymentMethod)).apply(this, arguments));
    }

    return PaymentMethod;
  }(library.Base);

  library.PaymentMethod.className = 'PaymentMethod';
  library.PaymentMethod.queryName = 'payment_methods';

  library.PaymentMethod.hasMany('transactions', { as: 'paymentMethod' });
});
Occasion.Modules.push(function (library) {
  library.Product = function (_library$Base9) {
    _inherits(Product, _library$Base9);

    function Product() {
      _classCallCheck(this, Product);

      return _possibleConstructorReturn(this, (Product.__proto__ || Object.getPrototypeOf(Product)).apply(this, arguments));
    }

    return Product;
  }(library.Base);

  library.Product.className = 'Product';
  library.Product.queryName = 'products';

  library.Product.belongsTo('merchant');
  library.Product.belongsTo('venue');

  library.Product.hasMany('orders');
  library.Product.hasMany('questions');
  library.Product.hasMany('timeSlots');
});
Occasion.Modules.push(function (library) {
  library.Question = function (_library$Base10) {
    _inherits(Question, _library$Base10);

    function Question() {
      _classCallCheck(this, Question);

      return _possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).apply(this, arguments));
    }

    return Question;
  }(library.Base);

  library.Question.className = 'Question';
  library.Question.queryName = 'questions';

  library.Question.belongsTo('product');
  library.Question.hasMany('answers');
  library.Question.hasMany('options');
});
Occasion.Modules.push(function (library) {
  library.TimeSlot = function (_library$Base11) {
    _inherits(TimeSlot, _library$Base11);

    function TimeSlot() {
      _classCallCheck(this, TimeSlot);

      return _possibleConstructorReturn(this, (TimeSlot.__proto__ || Object.getPrototypeOf(TimeSlot)).apply(this, arguments));
    }

    return TimeSlot;
  }(library.Base);

  library.TimeSlot.className = 'TimeSlot';
  library.TimeSlot.queryName = 'time_slots';

  library.TimeSlot.belongsTo('product');
  library.TimeSlot.belongsTo('venue');
});
Occasion.Modules.push(function (library) {
  library.Transaction = function (_library$Base12) {
    _inherits(Transaction, _library$Base12);

    function Transaction() {
      _classCallCheck(this, Transaction);

      return _possibleConstructorReturn(this, (Transaction.__proto__ || Object.getPrototypeOf(Transaction)).apply(this, arguments));
    }

    return Transaction;
  }(library.Base);

  library.Transaction.className = 'Transaction';
  library.Transaction.queryName = 'transactions';

  library.Transaction.belongsTo('order');
  library.Transaction.belongsTo('paymentMethod', { polymorphic: true });
});
Occasion.Modules.push(function (library) {
  library.Venue = function (_library$Base13) {
    _inherits(Venue, _library$Base13);

    function Venue() {
      _classCallCheck(this, Venue);

      return _possibleConstructorReturn(this, (Venue.__proto__ || Object.getPrototypeOf(Venue)).apply(this, arguments));
    }

    return Venue;
  }(library.Base);

  library.Venue.className = 'Venue';
  library.Venue.queryName = 'venues';

  library.Venue.belongsTo('merchant');

  library.Venue.hasMany('products');
});
Occasion.Modules.push(function (library) {
  library.CreditCard = function (_library$PaymentMetho) {
    _inherits(CreditCard, _library$PaymentMetho);

    function CreditCard() {
      _classCallCheck(this, CreditCard);

      return _possibleConstructorReturn(this, (CreditCard.__proto__ || Object.getPrototypeOf(CreditCard)).apply(this, arguments));
    }

    return CreditCard;
  }(library.PaymentMethod);

  library.CreditCard.className = 'CreditCard';
  library.CreditCard.queryName = 'credit_cards';

  library.CreditCard.hasMany('transactions', { as: 'paymentMethod' });
});
Occasion.Modules.push(function (library) {
  library.GiftCard = function (_library$PaymentMetho2) {
    _inherits(GiftCard, _library$PaymentMetho2);

    function GiftCard() {
      _classCallCheck(this, GiftCard);

      return _possibleConstructorReturn(this, (GiftCard.__proto__ || Object.getPrototypeOf(GiftCard)).apply(this, arguments));
    }

    return GiftCard;
  }(library.PaymentMethod);

  library.GiftCard.className = 'GiftCard';
  library.GiftCard.queryName = 'gift_cards';

  library.GiftCard.belongsTo('customer');
  library.GiftCard.hasMany('transactions', { as: 'paymentMethod' });
});

return Occasion;

}));
