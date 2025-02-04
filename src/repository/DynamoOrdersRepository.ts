import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Order } from "../entities/order";
import { env } from "../config/env";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IOrdersRepository } from "../useCases/PlaceOrder";
import { Inject } from "../di/Inject";
import { ILogGateway } from "../interfaces/gateways/ILogGateway";

// @Injectable()
export class DynamoOrdersRepository implements IOrdersRepository {
  private client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      region: env.AWS_REGION,
    })
  );

  constructor(@Inject("LogGateway") private readonly logGateway: ILogGateway) {}

  async create(order: Order): Promise<void> {
    const command = new PutCommand({
      TableName: "Orders",
      Item: order,
    });

    await this.logGateway.log({ order });

    await this.client.send(command);
  }
}
