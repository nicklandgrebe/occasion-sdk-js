var OccasionSDKSpecs = {};

describe('Occasion.Order', function() {
  beforeEach(function() {
    moxios.install();

    window.onSuccess = jasmine.createSpy('onSuccess');
    window.onFailure = jasmine.createSpy('onFailure');
    window.onCompletion = jasmine.createSpy('onCompletion');

    this.occsnClient = Occasion.Client('my_token');
  });

  afterEach(function() {
    moxios.uninstall();
  });

  describe('construct', function() {
    beforeEach(function () {
      this.occsnClient.Product.find('1kbsdf')
      .then(window.onSuccess);

      var _this = this;
      this.promise = moxios.wait(function() {
        return moxios.requests.mostRecent().respondWith(JsonApiResponses.Product.find.success)
        .then(function() {
          _this.product = window.onSuccess.calls.mostRecent().args[0];
        });
      });

      this.promise2 = this.promise.then(function() {
        _this.occsnClient.Order.construct({ product: _this.product })
        .then(window.onSuccess);

        return moxios.wait(function() {
          return moxios.requests.mostRecent().respondWith(JsonApiResponses.Question.all.success)
          .then(function() {
            _this.order = window.onSuccess.calls.mostRecent().args[0];
          });
        });
      });
    });

    it('builds a customer', function() {
      var _this = this;
      return this.promise2.then(function() {
        expect(_this.order.customer().attributes()).toEqual({
          email: null,
          firstName: null,
          lastName: null,
          zip: null
        });
      });
    });

    it('loads product questions', function() {
      return this.promise2.then(function() {
        expect(moxios.requests.mostRecent().url).toEqual('https://example.com/api/v1/products/1/questions/?include=options');
      });
    });

    it('populates blank answers for each question', function() {
      var _this = this;
      return this.promise2.then(function() {
        var questionIds = _this.order.answers().target().map(function(t) { return t.question().id }).toArray();

        expect(questionIds).toEqual(["1", "2"]);
      });
    });
  });

  describe('transactions', function() {
    beforeEach(function() {
      this.order = this.occsnClient.Order.build();
      this.paymentMethod = this.occsnClient.CreditCard.build({ id: 'cc_token' });
    });

    describe('charge', function() {
      beforeEach(function() {
        this.order.charge(this.paymentMethod, 10.0);
      });

      it('adds transaction', function() {
        expect(this.order.transactions().size()).toEqual(1);
      });

      it('adds amount to transaction', function() {
        expect(this.order.transactions().target().first().amount).toEqual(10.0);
      });

      it('adds paymentMethod transaction', function() {
        expect(this.order.transactions().target().first().paymentMethod()).toEqual(this.paymentMethod);
      });
    });

    describe('editCharge', function() {
      beforeEach(function() {
        this.order.charge(this.paymentMethod, 10.0);

        this.order.editCharge(this.paymentMethod, 1000.0);
      });

      it('changes payment method\'s transaction amount', function() {
        expect(this.order.transactions().target().first().amount).toEqual(1000.0);
      });
    });

    describe('removeCharge', function() {
      beforeEach(function() {
        this.order.charge(this.paymentMethod, 10.0);

        this.order.removeCharge(this.paymentMethod);
      });

      it('removes the charge', function() {
        expect(this.order.transactions().empty()).toBeTruthy();
      });
    });
  });
});