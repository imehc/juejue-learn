import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, of, tap } from 'rxjs';
import requestIp from 'request-ip';
import { HttpService } from '@nestjs/axios';
import iconv from 'iconv-lite';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name);

  @Inject(HttpService)
  private readonly httpService: HttpService;

  /** 根据ip获取城市 */
  async ipToCity(ip: string) {
    // https://whois.pconline.com.cn/ipJson.jsp?ip=221.237.121.165&json=true
    const response = await this.httpService.axiosRef(
      `https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
      {
        responseType: 'arraybuffer',
        transformResponse: (data) => {
          // 该结构返回的gbk，需要转换为utf-8,使用iconv-lite
          return JSON.parse(iconv.decode(data, 'gbk'));
        },
      },
    );
    return response.data.addr;
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const userAgent = request.headers['user-agent'];

    const { ip, method, path } = request;
    // 获取客户端真实IP, 比如nginx代理转发的ip
    const clientIp = requestIp.getClientIp(request) || ip;
    this.logger.debug(`${context.getClass().name}---- ${path} invoked...`);

    const now = Date.now();

    return next.handle().pipe(
      tap(async (res) => {
        // this.logger.debug(
        //   `${method} ${path} ${clientIp} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        // );
        if (
          path === '/auth/login' &&
          method === 'POST' &&
          response.statusCode === 200
        ) {
          // const city = await this.ipToCity(clientIp);
          // TDDO: 登录成功后，记录该用户登录信息，比如userAgent、IP、city,避免多次请求
        }
      }),
      catchError((err) => {
        const message =
          err.response?.message instanceof Array
            ? err.response?.message?.at(0)
            : err.response?.message;
        this.logger.error(message);
        return of(message);
      }),
    );
  }
}
