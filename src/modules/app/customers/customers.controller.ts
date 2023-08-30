import { Controller } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { User } from 'src/utils/decorators';
import { AuthUser } from 'src/utils/interfaces';

@Controller('customers')
export class CustomersController {}
