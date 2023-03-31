import { IInterceptor } from './Interceptor';

const base: IInterceptor = {
  sampleTextProp: 'Hello world!',
};

export const mockInterceptorProps = {
  base,
};
