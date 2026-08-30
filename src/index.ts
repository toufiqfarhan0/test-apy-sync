import express from "express";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import paymentsRouter from "./routes/payments";
import webhooksRouter from "./routes/webhooks";
import teamsRouter from "./routes/teams";
import notificationsRouter from "./routes/notifications";
import analyticsRouter from "./routes/analytics";

const app = express();
app.use(express.json());

app.use(usersRouter);
app.use(authRouter);
app.use(productsRouter);
app.use(ordersRouter);
app.use(paymentsRouter);
app.use(webhooksRouter);
app.use(teamsRouter);
app.use(notificationsRouter);
app.use(analyticsRouter);

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
