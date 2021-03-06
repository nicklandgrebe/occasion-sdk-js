describe('Occasion.Product', function() {
  beforeEach(function() {
    this.occsnClient = Occasion.Client({ token: 'my_token' })

    moxios.install(this.occsnClient.interface.axios)

    window.onSuccess = jasmine.createSpy('onSuccess')
    window.onFailure = jasmine.createSpy('onFailure')
    window.onCompletion = jasmine.createSpy('onCompletion')
  })

  afterEach(function() {
    moxios.uninstall()
  })

  describe('default timeZone', function() {
    beforeEach(function() {
      moxios.stubRequest(/.+\/products\/1kbsdf.*/, JsonApiResponses.Product.find.includes)

      this.occsnClient.Product.includes('merchant')
        .find('1kbsdf')
        .then(window.onSuccess)

      this.promise = moxios.wait(() => {
        this.product = window.onSuccess.calls.mostRecent().args[0]
      })
    })

    it('adds timeZone to product.firstTimeSlotStartsAt', function() {
      return this.promise.then(() => {
        expect(this.product.firstTimeSlotStartsAt.format('z')).toEqual('PDT')
      })
    })
  })

  describe('attendeeQuestions', function() {
    beforeEach(function() {
      moxios.stubRequest(/.+\/products\/1kbsdf.*/, JsonApiResponses.Product.attendees)

      this.occsnClient.Product.find('1kbsdf').then(window.onSuccess)

      this.promise = moxios.wait(() => {
        this.product = window.onSuccess.calls.mostRecent().args[0]
      })
    })

    it('builds Collection of attendeeQuestions', function() {
      return this.promise.then(() => {
        expect(this.product.attendeeQuestions.empty()).toBeFalsy()
      })
    })

    it('camelizes attendeeQuestions', function() {
      return this.promise.then(() => {
        expect(this.product.attendeeQuestions.first()).toEqual('firstName')
      })
    })
  })

  describe('constructCalendar(month)', function() {
    beforeEach(function() {
      jasmine.clock().mockDate(moment.tz('2018-05-09', 'America/Los_Angeles').toDate())

      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-01.+/,
        JsonApiResponses.TimeSlot.calendar[0]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-08.+/,
        JsonApiResponses.TimeSlot.calendar[1]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-15.+/,
        JsonApiResponses.TimeSlot.calendar[2]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-22.+/,
        JsonApiResponses.TimeSlot.calendar[3]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-05-29.+/,
        JsonApiResponses.TimeSlot.calendar[4]
      )

      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-06-01.+/,
        JsonApiResponses.TimeSlot.calendar[0]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-06-08.+/,
        JsonApiResponses.TimeSlot.calendar[1]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-06-15.+/,
        JsonApiResponses.TimeSlot.calendar[2]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-06-22.+/,
        JsonApiResponses.TimeSlot.calendar[3]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-06-29.+/,
        JsonApiResponses.TimeSlot.calendar[4]
      )

      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-07-01.+/,
        JsonApiResponses.TimeSlot.calendar[0]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-07-08.+/,
        JsonApiResponses.TimeSlot.calendar[1]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-07-15.+/,
        JsonApiResponses.TimeSlot.calendar[2]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-07-22.+/,
        JsonApiResponses.TimeSlot.calendar[3]
      )
      moxios.stubRequest(
        /.+\/products\/.+\/time_slots\/\?.*filter%5Bstarts_at%5D%5Bge%5D=2018-07-29.+/,
        JsonApiResponses.TimeSlot.calendar[4]
      )

      this.occsnClient.Product.find('1kbsdf').then(window.onSuccess)

      this.promise = moxios.wait(() => {
        return moxios.requests
          .mostRecent()
          .respondWith(JsonApiResponses.Product.calendar)
          .then(() => {
            this.product = window.onSuccess.calls.mostRecent().args[0]

            return this.product.constructCalendar().then(collection => {
              this.calendarCollection = collection
            })
          })
      })
    })

    afterEach(function() {
      jasmine.clock().uninstall()
    })

    it('starts at current day and adds all days in current month as items to collection', function() {
      return this.promise.then(() => {
        expect(this.calendarCollection.size()).toBe(31)
      })
    })
  })
})
