import ExternalServices from './ExternalServices.mjs';

// For backwards compatibility, we'll extend ExternalServices
export default class ProductData extends ExternalServices {
  constructor() {
    super();
  }
}