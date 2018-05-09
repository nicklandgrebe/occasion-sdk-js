describe('Occasion.Product', function() {
  beforeEach(function() {
    this.occsnClient = Occasion.Client({ token: 'my_token' });

    moxios.install(this.occsnClient.interface.axios);

    window.onSuccess = jasmine.createSpy('onSuccess');
    window.onFailure = jasmine.createSpy('onFailure');
    window.onCompletion = jasmine.createSpy('onCompletion');
  });

  afterEach(function() {
    moxios.uninstall();
  });

  describe('default timeZone', function() {
    beforeEach(function () {
      moxios.stubRequest(/.+\/products\/1kbsdf.*/, JsonApiResponses.Product.find.includes);
      this.promise = this.occsnClient.Product.includes('merchant').find('1kbsdf')
      .then(window.onSuccess);

      this.promise = moxios.wait(() => {
        this.product = window.onSuccess.calls.mostRecent().args[0];
      });
    });

    it('adds timeZone to product.firstTimeSlotStartsAt', function() {
      return this.promise.then(() => {
        expect(this.product.firstTimeSlotStartsAt.format('z')).toEqual('PDT');
      });
    });
  });

  describe('attendeeQuestions', function() {
    beforeEach(function () {
      this.occsnClient.Product.find('1kbsdf')
      .then(window.onSuccess);

      this.promise = moxios.wait(() => {
        return moxios.requests.mostRecent().respondWith(JsonApiResponses.Product.attendees)
        .then(() => {
          this.product = window.onSuccess.calls.mostRecent().args[0];
        });
      });
    });

    it('builds Collection of attendeeQuestions', function() {
      return this.promise.then(() => {
        expect(this.product.attendeeQuestions.empty()).toBeFalsy();
      });
    });

    it('camelizes attendeeQuestions', function() {
      return this.promise.then(() => {
        expect(this.product.attendeeQuestions.first()).toEqual('firstName');
      });
    });
  });

  describe('constructCalendar(month)', function() {
    beforeEach(function () {
      this.occsnClient.Product.find('1kbsdf')
      .then(window.onSuccess);

      this.promise = moxios.wait(() => {
        return moxios.requests.mostRecent().respondWith(JsonApiResponses.Product.calendar)
        .then(() => {
          this.product = window.onSuccess.calls.mostRecent().args[0];
        });
      });
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    describe('no month arg', function() {
      beforeEach(function() {
        jasmine.clock().mockDate(moment.tz('2018-05-09', 'America/Los_Angeles').toDate());

        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-09.+/, JsonApiResponses.TimeSlot.calendar[1]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-16.+/, JsonApiResponses.TimeSlot.calendar[2]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-23.+/, JsonApiResponses.TimeSlot.calendar[3]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-30.+/, JsonApiResponses.TimeSlot.calendar[4]);

        this.promise2 = this.promise.then(() => {
          return this.product.constructCalendar().then((collection) => {
            this.calendarCollection = collection;
          });
        });
      });

      it('starts at current day and adds all days in current month as items to collection', function() {
        return this.promise2.then(() => {
          expect(this.calendarCollection.size()).toBe(31);
        });
      });
    });

    describe('current month as arg', function() {
      beforeEach(function() {
        jasmine.clock().mockDate(moment('2018-05-09').toDate());

        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-09.+/, JsonApiResponses.TimeSlot.calendar[1]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-16.+/, JsonApiResponses.TimeSlot.calendar[2]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-23.+/, JsonApiResponses.TimeSlot.calendar[3]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-30.+/, JsonApiResponses.TimeSlot.calendar[4]);

        this.promise2 = this.promise.then(() => {
          return this.product.constructCalendar(moment('2018-05-01')).then((collection) => {
            this.calendarCollection = collection;
          });
        });
      });

      it('starts at current day and adds all days in current month as items to collection', function() {
        return this.promise2.then(() => {
          expect(this.calendarCollection.size()).toBe(31);
        });
      });

      describe('nextPage()', function() {
        beforeEach(function() {
          this.promise3 = this.promise2.then(() => {
            this.product.constructCalendar = window.mockConstructCalendar = jasmine.createSpy('constructCalendar');

            return this.calendarCollection.nextPage();
          });
        });

        it('calls next month of timeSlots', function() {
          return this.promise3.then(() => {
            expect(window.mockConstructCalendar.calls.mostRecent().args[0].isSame(moment('2018-06-01'))).toBeTruthy();
          });
        });
      });

      describe('prevPage()', function() {
        beforeEach(function() {
          this.promise3 = this.promise2.then(() => {
            this.product.constructCalendar = window.mockConstructCalendar = jasmine.createSpy('constructCalendar');

            return this.calendarCollection.prevPage();
          });
        });

        it('does not call prev month of timeSlots', function() {
          return this.promise3.then(() => {
            expect(window.mockConstructCalendar.calls.count()).toEqual(0);
          });
        });
      });
    });

    describe('other month as arg', function() {
      beforeEach(function() {
        jasmine.clock().mockDate(moment('2018-04-01').toDate());

        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-01.+/, JsonApiResponses.TimeSlot.calendar[0]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-08.+/, JsonApiResponses.TimeSlot.calendar[1]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-15.+/, JsonApiResponses.TimeSlot.calendar[2]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-22.+/, JsonApiResponses.TimeSlot.calendar[3]);
        moxios.stubRequest(/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-29.+/, JsonApiResponses.TimeSlot.calendar[4]);

        this.promise2 = this.promise.then(() => {
          return this.product.constructCalendar(moment('2018-05-01')).then((collection) => {
            this.calendarCollection = collection;
          });
        });
      });

      it('returns CollectionResponse', function() {
        return this.promise2.then(() => {
          expect(this.calendarCollection.klass()).toBe(ActiveResource.CollectionResponse);
        });
      });

      it('returns collection separated by objects with day and timeSlot keys', function() {
        return this.promise2.then(() => {
          expect(this.calendarCollection.first().day).toBeDefined();
          expect(this.calendarCollection.first().timeSlots).toBeDefined();
        });
      });

      it('returns item.day as moment object', function() {
        return this.promise2.then(() => {
          expect(this.calendarCollection.first().day.format).toBeDefined();
        });
      });

      it('returns item.timeSlots as Collection', function() {
        return this.promise2.then(() => {
          expect(this.calendarCollection.first().timeSlots.klass()).toBe(ActiveResource.Collection);
        });
      });

      it('adds all days in month as items to collection', function() {
        return this.promise2.then(() => {
          expect(this.calendarCollection.size()).toBe(31);
        });
      });

      it('adds all timeSlots for each day to item.timeSlots', function() {
        return this.promise2.then(() => {
          expect(this.calendarCollection.first().timeSlots.size()).toBe(2);
          expect(this.calendarCollection.last().timeSlots.size()).toBe(5);
        });
      });

      describe('nextPage()', function() {
        beforeEach(function() {
          this.promise3 = this.promise2.then(() => {
            this.product.constructCalendar = window.mockConstructCalendar = jasmine.createSpy('constructCalendar');

            return this.calendarCollection.nextPage();
          });
        });

        it('calls next month of timeSlots', function() {
          return this.promise3.then(() => {
            expect(window.mockConstructCalendar.calls.mostRecent().args[0].isSame(moment('2018-06-01'))).toBeTruthy();
          });
        });
      });

      describe('prevPage()', function() {
        beforeEach(function() {
          this.promise3 = this.promise2.then(() => {
            this.product.constructCalendar = window.mockConstructCalendar = jasmine.createSpy('constructCalendar');

            return this.calendarCollection.prevPage();
          });
        });

        it('calls prev month of timeSlots', function() {
          return this.promise3.then(() => {
            expect(window.mockConstructCalendar.calls.mostRecent().args[0].isSame(moment('2018-04-01'))).toBeTruthy();
          });
        });
      });
    });
  });
});
