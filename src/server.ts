import 'source-map-support/register'

import { getConfig } from "DoubleTroubleServer/config";
import * as DoubleTroubleServer from "DoubleTroubleServer";

DoubleTroubleServer.init(getConfig());