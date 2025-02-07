import en from './en.json'
import es from './es.json'
import pt from './pt.json'
import enCountry from './en-country.json'
import esCountry from './es-country.json'
import ptCountry from './pt-country.json'

export default {
  en: {
    ...en,
    ...enCountry
  }, es: {
    ...es,
    ...esCountry
  }, pt: {
    ...pt,
    ...ptCountry
  }
}

