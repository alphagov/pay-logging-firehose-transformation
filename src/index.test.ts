import { handler } from './index'

describe('Test data transformer', () => {
  test('should return the transformed record ', async () => {

    const event = {
      'records': [
        {
          'recordId': 'a record id',
          'approximateArrivalTimestamp': 1702212345678,
          'data': Buffer.from(JSON.stringify('hellow world')).toString('base64'),
        },
      ],
    }
    const context = {ctx: 'hello'}
    // noinspection TypeScriptValidateTypes
    const result = await handler(event, context)
    expect(result[0].recordId).toStrictEqual('a record id')
    expect(result[0].result).toStrictEqual('Ok')
    expect(result[0].data).toStrictEqual('ImhlbGxvdyB3b3JsZCI=')
  })

})
