"use client"

import { metrics_list } from "../metrics/fullmetricslist"
import React, {useState, useContext} from 'react';
import { useRouter } from 'next/navigation';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

  import {
    Button
  } from "@/components/ui/button"

  import {
    Button2 
  } from "@/components/ui/button2"
   
  export function BoneMenu() {

    let [boneName, setBoneName] = useState("bone name");
    const router = useRouter();

    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h4>Cranial Metrics</h4>
          </AccordionTrigger>
          <AccordionContent>
            {metrics_list.cranial_metrics.map((name, i) => <Button className="text-left" variant="ghost" name={name} key={i}> {name} </Button>)}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <h4>Cranial Nonmetrics</h4>
          </AccordionTrigger>
          <AccordionContent>
            Put Cranial Nonmetrics Here 
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger> 
            <h4>Postcranial Metrics</h4>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 w-24">
              {metrics_list.postcranial_metrics.map((name, i) => 
              <Button2 className="text-left" variant="ghost" name={name} key={i} 
              onClick={() => {
                setBoneName(name);
                router.push(`/bone-editor?boneName=${encodeURIComponent(name)}`);
              }}
            > 
            {name} </Button2>)}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }