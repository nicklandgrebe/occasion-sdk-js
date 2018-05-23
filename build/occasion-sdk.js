(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["active-resource","axios","moment","underscore","underscore.string","moment-timezone-with-data-2010-2020"], function (a0,b1,c2,d3,e4,f5) {
      return (root['Occasion'] = factory(a0,b1,c2,d3,e4,f5));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("active-resource"),require("axios"),require("moment"),require("underscore"),require("underscore.string"),require("moment-timezone-with-data-2010-2020"));
  } else {
    root['Occasion'] = factory(root["active-resource"],root["axios"],root["moment"],root["underscore"],root["underscore.string"],root["moment-timezone-with-data-2010-2020"]);
  }
}(this, function (ActiveResource, axios, moment, _, s) {

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

ActiveResource.Interfaces.JsonApi.contentType = 'application/json';

var Occasion = function () {
  function Occasion() {
    _classCallCheck(this, Occasion);
  }

  _createClass(Occasion, null, [{
    key: 'Client',
    value: function Client() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var url = options.baseUrl || Occasion.baseUrl;
      var token = options.token;
      var immutable = options.immutable || false;

      if (!_.isString(token)) {
        throw 'Token must be of type string';
      }

      var encodedToken = window.btoa(unescape(encodeURIComponent(token + ':')));

      var libraryOptions = {
        headers: {
          Authorization: "Basic " + encodedToken
        },
        immutable: immutable
      };

      var resourceLibrary = ActiveResource.createResourceLibrary(url, libraryOptions);

      Occasion.Modules.each(function (initializeModule) {
        initializeModule(resourceLibrary);
      });

      return resourceLibrary;
    }
  }]);

  return Occasion;
}();

Occasion.baseUrl = 'https://occ.sn/api/v1';


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

  library.Answer.attributes('value');

  library.Answer.belongsTo('question');
  library.Answer.belongsTo('option');
  library.Answer.belongsTo('order', { inverseOf: 'answers' });
});

Occasion.Modules.push(function (library) {
  library.Attendee = function (_library$Base2) {
    _inherits(Attendee, _library$Base2);

    function Attendee() {
      _classCallCheck(this, Attendee);

      return _possibleConstructorReturn(this, (Attendee.__proto__ || Object.getPrototypeOf(Attendee)).apply(this, arguments));
    }

    return Attendee;
  }(library.Base);

  library.Attendee.className = 'Attendee';
  library.Attendee.queryName = 'attendees';

  library.Attendee.attributes('address', 'age', 'city', 'country', 'email', 'firstName', 'gender', 'lastName', 'phone', 'state', 'zip');

  library.Attendee.belongsTo('order', { inverseOf: 'attendees' });
});

Occasion.Modules.push(function (library) {
  library.Coupon = function (_library$Base3) {
    _inherits(Coupon, _library$Base3);

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
  library.Currency = function (_library$Base4) {
    _inherits(Currency, _library$Base4);

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
  library.Customer = function (_library$Base5) {
    _inherits(Customer, _library$Base5);

    function Customer() {
      _classCallCheck(this, Customer);

      return _possibleConstructorReturn(this, (Customer.__proto__ || Object.getPrototypeOf(Customer)).apply(this, arguments));
    }

    _createClass(Customer, [{
      key: 'ahoyEmailChanged',
      value: function ahoyEmailChanged() {
        /* TODO: Align customer data with Ahoy using +this+ */
      }
    }]);

    return Customer;
  }(library.Base);

  library.Customer.className = 'Customer';
  library.Customer.queryName = 'customers';

  library.Customer.attributes('email', 'firstName', 'lastName', 'zip');

  library.Customer.hasMany('orders', { inverseOf: 'customer' });

  library.Customer.afterBuild(function () {
    var lastEmail = null;
    var watchEmail = _.bind(function () {
      if (lastEmail != this.email) {
        _.bind(this.ahoyEmailChanged, this)();
        lastEmail = this.email;
      }

      setTimeout(watchEmail, 500);
    }, this);

    setTimeout(watchEmail, 500);
  });
});

Occasion.Modules.push(function (library) {
  library.Merchant = function (_library$Base6) {
    _inherits(Merchant, _library$Base6);

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
  library.Option = function (_library$Base7) {
    _inherits(Option, _library$Base7);

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
  library.Order = function (_library$Base8) {
    _inherits(Order, _library$Base8);

    function Order() {
      _classCallCheck(this, Order);

      return _possibleConstructorReturn(this, (Order.__proto__ || Object.getPrototypeOf(Order)).apply(this, arguments));
    }

    _createClass(Order, [{
      key: 'calculatePrice',


      // POSTs the order to `/orders/price`, which calculates price related fields and adds them to the order
      // @return [Promise] a promise for the order with price-related fields
      value: function calculatePrice() {
        return this.interface().post(this.klass().links()['related'] + 'price', this);
      }

      // POSTs the order to `/orders/information`, which calculates price + quantity related fields and adds them to the
      //   order
      // @return [Promise] a promise for the order with price & quantity related fields

    }, {
      key: 'retrieveInformation',
      value: function retrieveInformation() {
        return this.interface().post(this.klass().links()['related'] + 'information', this);
      }

      // Creates a transaction with a payment method and an amount
      //
      // @param [PaymentMethod] paymentMethod the payment method to charge
      // @param [Number] amount the amount to charge to the payment method
      // @return [Transaction] the built transaction representing the charge

    }, {
      key: 'charge',
      value: function charge(paymentMethod, amount) {
        this.transactions().build({
          amount: amount,
          paymentMethod: paymentMethod
        });
      }

      // Edits a transaction with a given payment method to have a new amount
      //
      // @param [PaymentMethod] paymentMethod the payment method to search transactions for
      // @param [Number] amount the new amount to charge to the payment method
      // @return [Transaction] the edited transaction representing the charge

    }, {
      key: 'editCharge',
      value: function editCharge(paymentMethod, amount) {
        var transaction = this.transactions().target().detect(function (t) {
          return t.paymentMethod() == paymentMethod;
        });

        if (transaction) {
          transaction.amount = amount;
        }
      }

      // Removes a transaction for a given payment method
      //
      // @param [PaymentMethod] paymentMethod the payment method to remove the transaction for

    }, {
      key: 'removeCharge',
      value: function removeCharge(paymentMethod) {
        var transaction = this.transactions().target().detect(function (t) {
          return t.paymentMethod() == paymentMethod;
        });

        if (transaction) {
          this.transactions().target().delete(transaction);
        }
      }

      // @private

      // Called by Order.construct, which injects order
      // @note Must return order
      //
      // @param [Occsn.Order] order the order that wants an answer to the question
      // @param [Occsn.Question] question the question to construct an answer for

    }], [{
      key: 'construct',
      value: function construct(attributes) {
        var order = this.build(attributes);

        order.sessionIdentifier = order.sessionIdentifier || Math.random().toString(36).substring(7) + '-' + Date.now();

        if (order.customer() == null) {
          order.buildCustomer({
            email: null,
            firstName: null,
            lastName: null,
            zip: null
          });
        }

        var promises = [new Promise(function (resolve) {
          resolve(order);
        })];

        if (order.product() != null) {
          promises.push(order.product().questions().includes('options').perPage(500).load());
        }

        var _this = this;
        return Promise.all(promises).then(function (args) {
          order = args[0];
          var questions = args[1];

          if (questions != undefined) questions.inject(order, _this.__constructAnswer);

          return order;
        });
      }
    }, {
      key: '__constructAnswer',
      value: function __constructAnswer(order, question) {
        if (question.category != 'static') {
          var answer = order.answers().build({
            question: question
          });

          switch (question.formControl) {
            case 'drop_down':
            case 'option_list':
              answer.assignOption(question.options().target().detect(function (o) {
                return o.default;
              }));
              break;
            case 'spin_button':
              answer.value = question.min;
              break;
          }
        }

        return order;
      }
    }]);

    return Order;
  }(library.Base);

  library.Order.className = 'Order';
  library.Order.queryName = 'orders';

  library.Order.attributes('sessionIdentifier', 'status');

  library.Order.belongsTo('coupon');
  library.Order.belongsTo('currency');
  library.Order.belongsTo('customer', { autosave: true, inverseOf: 'orders' });
  library.Order.belongsTo('merchant');
  library.Order.belongsTo('product');

  library.Order.hasMany('answers', { autosave: true, inverseOf: 'order' });
  library.Order.hasMany('attendees', { autosave: true, inverseOf: 'order' });
  library.Order.hasMany('timeSlots');
  library.Order.hasMany('transactions', { autosave: true, inverseOf: 'order' });

  library.Order.afterRequest(function () {
    if (this.product().quantityAware && !this.product().attendeeQuestions.empty()) {
      var diff = this.quantity - this.attendees().size();

      if (diff != 0) {
        for (var i = 0; i < Math.abs(diff); i++) {
          if (diff > 0) {
            this.attendees().build();
          } else {
            this.attendees().target().pop();
          }
        }
      }
    }
  });
});

Occasion.Modules.push(function (library) {
  library.PaymentMethod = function (_library$Base9) {
    _inherits(PaymentMethod, _library$Base9);

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
  library.Product = function (_library$Base10) {
    _inherits(Product, _library$Base10);

    function Product() {
      _classCallCheck(this, Product);

      return _possibleConstructorReturn(this, (Product.__proto__ || Object.getPrototypeOf(Product)).apply(this, arguments));
    }

    _createClass(Product, [{
      key: 'constructCalendar',
      value: function constructCalendar(month) {
        return this.__constructCalendar(month);
      }
    }, {
      key: '__constructCalendar',
      value: function __constructCalendar(month, preload, prevPagePromise) {
        var timeZone = this.merchant().timeZone;

        var today = moment.tz(timeZone);
        var lowerRange;
        if (month) {
          lowerRange = month.isSame(today, 'month') ? today : month.tz(timeZone).startOf('month');
        } else {
          lowerRange = today;
        }
        var upperRange = lowerRange.clone().endOf('month');

        var numRequests = Math.ceil(upperRange.diff(lowerRange, 'days') / this.monthlyTimeSlotDaysBatchSize);
        if (numRequests < 1) numRequests = 1;

        var i = 0;
        var requests = [];

        var lower = lowerRange.clone();
        var upper = lowerRange.clone().add(this.monthlyTimeSlotDaysBatchSize, 'days');
        while (i < numRequests) {
          if (i + 1 == numRequests) upper = upperRange.clone();

          requests.push(this.timeSlots().where({
            startsAt: {
              ge: lower.toDate(),
              le: upper.toDate()
            },
            status: 'bookable'
          }).all());

          lower.add(this.monthlyTimeSlotDaysBatchSize, 'days');
          upper.add(this.monthlyTimeSlotDaysBatchSize, 'days');
          i++;
        }

        var product = this;

        var currentPromise = Promise.all(requests).then(function (timeSlotsArray) {
          var allTimeSlots = ActiveResource.Collection.build(timeSlotsArray).map(function (ts) {
            return ts.toArray();
          }).flatten();

          var startDate = moment(lowerRange).startOf('month');
          var endDate = moment(lowerRange).endOf('month');

          var response = ActiveResource.CollectionResponse.build();

          var day = startDate;
          while (day.isSameOrBefore(endDate)) {
            response.push({
              day: day,
              timeSlots: allTimeSlots.select(function (timeSlot) {
                return timeSlot.startsAt.isSame(day, 'day');
              })
            });

            day = day.clone().add(1, 'days');
          }

          response.nextPage = function (preloadCount) {
            this.promise = this.promise || product.__constructCalendar(moment(upperRange).add(1, 'days').startOf('month'), preloadCount, currentPromise);

            return this.promise;
          };

          if (month && !month.isSame(today, 'month')) {
            response.prevPage = function () {
              this.promise = this.promise || prevPagePromise || product.__constructCalendar(moment(lowerRange).subtract(1, 'months'), 0);

              return this.promise;
            };
          }

          if (product.monthlyTimeSlotPreloadSize > 0) {
            if (_.isUndefined(preload)) {
              response.nextPage(product.monthlyTimeSlotPreloadSize - 1);
            } else if (preload > 0) {
              response.nextPage(--preload);
            }
          }

          return response;
        });

        return currentPromise;
      }
    }]);

    return Product;
  }(library.Base);

  library.Product.className = 'Product';
  library.Product.queryName = 'products';

  library.Product.belongsTo('merchant');
  library.Product.belongsTo('venue');

  library.Product.hasMany('orders');
  library.Product.hasMany('questions');
  library.Product.hasMany('redeemables');
  library.Product.hasMany('timeSlots');

  library.Product.afterRequest(function () {
    this.attendeeQuestions = ActiveResource.Collection.build(this.attendeeQuestions).map(function (q) {
      return s.camelize(q, true);
    });

    if (this.firstTimeSlotStartsAt) {
      if (this.merchant()) {
        this.firstTimeSlotStartsAt = moment.tz(this.firstTimeSlotStartsAt, this.merchant().timeZone);
      } else {
        throw 'Product has timeslots - but merchant.timeZone is not available; include merchant in response.';
      }
    }
  });
});

Occasion.Modules.push(function (library) {
  library.Question = function (_library$Base11) {
    _inherits(Question, _library$Base11);

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
  // TODO: Remove ability to directly query redeemables
  library.Redeemable = function (_library$Base12) {
    _inherits(Redeemable, _library$Base12);

    function Redeemable() {
      _classCallCheck(this, Redeemable);

      return _possibleConstructorReturn(this, (Redeemable.__proto__ || Object.getPrototypeOf(Redeemable)).apply(this, arguments));
    }

    return Redeemable;
  }(library.Base);

  library.Redeemable.className = 'Redeemable';
  library.Redeemable.queryName = 'redeemables';

  library.Redeemable.belongsTo('product');
});
Occasion.Modules.push(function (library) {
  library.State = function (_library$Base13) {
    _inherits(State, _library$Base13);

    function State() {
      _classCallCheck(this, State);

      return _possibleConstructorReturn(this, (State.__proto__ || Object.getPrototypeOf(State)).apply(this, arguments));
    }

    return State;
  }(library.Base);

  library.State.className = 'State';
  library.State.queryName = 'states';
});

Occasion.Modules.push(function (library) {
  library.TimeSlot = function (_library$Base14) {
    _inherits(TimeSlot, _library$Base14);

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

  library.TimeSlot.afterRequest(function () {
    if (this.product().merchant()) {
      this.startsAt = moment.tz(this.startsAt, this.product().merchant().timeZone);
    } else {
      throw 'Must use includes({ product: \'merchant\' }) in timeSlot request';
    }

    this.duration = moment.duration(this.duration, 'minutes');
  });
});

Occasion.Modules.push(function (library) {
  library.Transaction = function (_library$Base15) {
    _inherits(Transaction, _library$Base15);

    function Transaction() {
      _classCallCheck(this, Transaction);

      return _possibleConstructorReturn(this, (Transaction.__proto__ || Object.getPrototypeOf(Transaction)).apply(this, arguments));
    }

    return Transaction;
  }(library.Base);

  library.Transaction.className = 'Transaction';
  library.Transaction.queryName = 'transactions';

  library.Transaction.attributes('amount');

  library.Transaction.belongsTo('order', { inverseOf: 'answers' });
  library.Transaction.belongsTo('paymentMethod', { polymorphic: true });
});

Occasion.Modules.push(function (library) {
  library.Venue = function (_library$Base16) {
    _inherits(Venue, _library$Base16);

    function Venue() {
      _classCallCheck(this, Venue);

      return _possibleConstructorReturn(this, (Venue.__proto__ || Object.getPrototypeOf(Venue)).apply(this, arguments));
    }

    return Venue;
  }(library.Base);

  library.Venue.className = 'Venue';
  library.Venue.queryName = 'venues';

  library.Venue.belongsTo('merchant');
  library.Venue.belongsTo('state');

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
